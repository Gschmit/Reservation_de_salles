""" The URLs """
from django.urls import path
from . import views

app_name = 'booking_meeting_room'
urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('room/<int:room_id>/', views.RoomView.as_view(), name='room_view'),
    path('user/<int:user_id>/', views.UserView.as_view(), name='user_view'),
    path('meeting/<int:meeting_id>', views.MeetingView.as_view(), name='meeting_view'),
#    path('room/<int:room_id>/<int:year>_<int:month>_<int:day>_<int:hour>_<int:minute>',
#         views.IsRoomFreeView.as_view(), name='is_free_room_view'),
    path('meeting_list', views.MeetingListView.as_view(), name='meeting_list_view'),
]

# path('new_meeting', views.new_meeting_view, name='new_meeting_view')
