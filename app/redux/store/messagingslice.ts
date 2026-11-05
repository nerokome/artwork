import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

export interface AppNotification {
  id: string
  type: 'follow' | 'message' | string
  content: string
  createdAt: string
  isRead: boolean
}

interface NotificationResponse {
  id?: string
  _id?: string
  type?: 'follow' | 'message' | string
  content?: string
  createdAt?: string
  isRead?: boolean
}

interface MessagingState {
  notifications: AppNotification[]
  notificationsLoading: boolean
  notificationsError: string | null
}

const initialState: MessagingState = {
  notifications: [],
  notificationsLoading: false,
  notificationsError: null,
}

export const fetchNotifications = createAsyncThunk<
  AppNotification[],
  string,
  { rejectValue: string }
>('messaging/fetchNotifications', async (token, { rejectWithValue, signal }) => {
  try {
    const { data } = await axios.get<{ notifications: NotificationResponse[] }>(
      `${BASE_URL}/notifications`,
      { headers: { Authorization: `Bearer ${token}` }, signal }
    )
    return (data.notifications ?? []).flatMap((notification) => {
      const id = notification.id || notification._id
      if (!id) return []
      return [{
        id,
        type: notification.type || 'message',
        content: notification.content || '',
        createdAt: notification.createdAt || new Date().toISOString(),
        isRead: notification.isRead ?? false,
      }]
    })
  } catch (requestError) {
    return rejectWithValue(
      axios.isAxiosError(requestError)
        ? requestError.response?.data?.error || requestError.response?.data?.message || 'Could not load notifications.'
        : 'Could not load notifications.'
    )
  }
})

export const markNotificationRead = createAsyncThunk<
  string,
  { id: string; token: string },
  { rejectValue: string }
>('messaging/markNotificationRead', async ({ id, token }, { rejectWithValue }) => {
  try {
    await axios.patch(
      `${BASE_URL}/notifications/${encodeURIComponent(id)}/read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return id
  } catch (requestError) {
    return rejectWithValue(
      axios.isAxiosError(requestError)
        ? requestError.response?.data?.error || requestError.response?.data?.message || 'Could not mark notification as read.'
        : 'Could not mark notification as read.'
    )
  }
})

const messagingSlice = createSlice({
  name: 'messaging',
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.notifications = []
      state.notificationsError = null
      state.notificationsLoading = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.notificationsLoading = true
        state.notificationsError = null
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notificationsLoading = false
        state.notifications = action.payload
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.notificationsLoading = false
        state.notificationsError = action.payload || 'Could not load notifications.'
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const notification = state.notifications.find((item) => item.id === action.payload)
        if (notification) notification.isRead = true
      })
  },
})

export const { clearNotifications } = messagingSlice.actions

export default messagingSlice.reducer
