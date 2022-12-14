""" The URLs """
from django.urls import path
from . import views

# paths :
# cd Documents\01_Outil de gestion\1_Réservation_de_salle\room_reservation\Front end
# cd Documents\01_Outil de gestion\1_Réservation_de_salle\room_reservation\Back end\database

app_name = 'booking_meeting_room'
urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('room/<int:room_id>/', views.RoomView.as_view(), name='room_view'),
    path('user/<int:user_id>/', views.UserView.as_view(), name='user_view'),
    path('meeting/<int:meeting_id>', views.MeetingView.as_view(), name='meeting_view'),
    path('user_next_meeting/<int:user_id>', views.UserNextMeetingView.as_view(),
         name='user_next_meeting_view'),
    path('meeting', views.HandleMeetingView.as_view(), name='handle_meeting_view'),
    path('room_list', views.RoomListView.as_view(), name='room_list_view'),
    path('meeting_list', views.MeetingListView.as_view(), name='meeting_list_view'),
    path('room_meetings/<int:room_id>', views.RoomMeetingsView.as_view(), name='room_meetings'),
]

# path('new_meeting', views.new_meeting_view, name='new_meeting_view')
