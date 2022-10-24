""" In charge of the views """

import datetime

from django.shortcuts import render, get_object_or_404


from .models import Meeting, Room, User

# from rest_framework import serializers, status
# from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
# from rest_framework import status

from booking_meeting_room.functions import shift_date

# TO DO : Make classes for grouping the views.


class IndexView(APIView):
    """
    For the first view of the app
    """
    @staticmethod
    def get(request):           # post ne fonctionne pas
        """
        For posting the view
        """
        context = {
        }
        return Response(data=context)


class RoomView(APIView):
    """
    View of a room
    """
    @staticmethod
    def get(request, room_id):              # mettre un "post" au lieu de "get" retourne une erreur
        """
        View of the room 'room_id'
        """                            # (voir fichier test.py pour plus de détail)
        room = get_object_or_404(Room, pk=room_id)
        context = {'room': room.toJSON()}
        return Response(data=context)


class UserView(APIView):
    """
    View of a user
    """
    @staticmethod
    def get(request, user_id):
        """
        View of the user 'user_id'
        """
        user = get_object_or_404(User, pk=user_id)
        context = {'user': user.toJSON()}
        return Response(data=context)


class MeetingView(APIView):
    """
    View of a meeting
    """
    @staticmethod
    def get(request, meeting_id):
        """
        View of the meeting 'meeting_id'
        """
        meeting = get_object_or_404(Meeting, pk=meeting_id)
        context = {'meeting': meeting.toJSON()}
        return Response(data=context)


class IsRoomFreeView(APIView):
    """
    To know if a room is free or not
    """
    @staticmethod
    def get(request, room_id, year, month, day, hour, minute):
        """
        View for knowing if a room is free or not at the date wanted
        """
        room = get_object_or_404(Room, pk=room_id)
        meeting_list = list(Meeting.objects.order_by('-start_timestamps'))
        date = datetime.datetime(year, month, day, hour, minute)
        if meeting_list:
            count = 0
            meeting = meeting_list[count]
            time_start = datetime.datetime(meeting.start_timestamps.year, meeting.start_timestamps.month,
                                           meeting.start_timestamps.day, meeting.start_timestamps.hour,
                                           meeting.start_timestamps.minute)
            duration = meeting.duration * 30
            end_y, end_mo, end_d, end_h, end_mi = shift_date(time_start.year, time_start.month, time_start.day, time_start.hour, time_start.minute, duration)
            time_end = datetime.datetime(end_y, end_mo, end_d, end_h, end_mi)
            bool_meeting = True
        else:
            count = -1
            time_start = "useless"
            time_end = date
            meeting = "No meeting scheduled"
            bool_meeting = False
        free = False
        while time_end <= date:
            count += 1
            if count == len(meeting_list):
                free = True
                break
            else:
                meeting = meeting_list[count]
                time_start = datetime.datetime(meeting.start_timestamps.year, meeting.start_timestamps.month,
                                               meeting.start_timestamps.day, meeting.start_timestamps.hour,
                                               meeting.start_timestamps.minute)
                duration = meeting.duration * 30
                end_y, end_mo, end_d, end_h, end_mi = shift_date(time_start.year, time_start.month, time_start.day, time_start.hour, time_start.minute, duration)
                time_end = datetime.datetime(end_y, end_mo, end_d, end_h, end_mi)
        if (not free) and (time_start > date):
            free = True
        context = {'room': room.toJSON(),
                   "free": free,
                   "meeting": meeting.toJSON(),
                   "bool_meeting": bool_meeting,
                   "date": date,
                   "day_name": date.strftime("%A"),
                   "month_name": date.strftime("%B")
                   }
        return Response(data=context)
# render(request, 'booking_meeting_room/is_free_room.html', context)


class MeetingListView(APIView):
    """
    View of the meetings list
    """
    @staticmethod
    def get(request):
        """
        For posting the view
        """
        latest_meeting_list: list[Meeting] = list(Meeting.objects.order_by('-start_timestamps')[:])
        latest_meeting_list.reverse()
        # context = {
        #     'latest_meeting_list': {f"meeting{index}": meet.toJSON() for index, meet in enumerate(latest_meeting_list)},
        # }
        context = {
            f"meeting{index}": meet.toJSON() for index, meet in enumerate(latest_meeting_list)
        }
        return Response(data=context)


''' def new_meeting_view(request):
    """
    View for creating a new meeting
    """
    context = {
    }
    return render(request, 'booking_meeting_room/new_meeting.html', context)

# utilité de la fonction ci-dessus ?
'''
