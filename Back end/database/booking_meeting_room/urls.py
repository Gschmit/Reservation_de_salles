""" The URLs """
from django.urls import path
from . import views

app_name = 'booking_meeting_room'
urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('room/<int:room_id>/', views.RoomView.as_view(), name='room_view'),
    path('user/<int:user_id>/', views.UserView.as_view(), name='user_view'),
    path('meeting/<int:meeting_id>', views.MeetingView.as_view(), name='meeting_view'),
    path('room_list', views.RoomListView.as_view(), name='room_list_view'),
    path('meeting_list', views.MeetingListView.as_view(), name='meeting_list_view'),
]

# path('new_meeting', views.new_meeting_view, name='new_meeting_view')
