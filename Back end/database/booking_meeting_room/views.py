""" In charge of the views """

import datetime

from django.shortcuts import get_object_or_404
from django.utils.timezone import make_aware

from .models import Meeting, Room, User

# from rest_framework import serializers, status
# from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
# from rest_framework import status

import booking_meeting_room.functions as func

# TYPING_ERROR_USERNAME = " @ Un_invité @ "


class IndexView(APIView):               # useless ?
    """
    For the first view of the app
    """
    @staticmethod
    def get(request):
        """
        For getting the view
        """
        context = {
        }
        return Response(data=context)


class RoomView(APIView):
    """
    View of a room
    """
    @staticmethod
    def get(request, room_id):
        """
        View of the room 'room_id'
        """
        room = get_object_or_404(Room, pk=room_id)
        context = {'room': room.toJSON()}
        return Response(data=context)

    @staticmethod
    def post(request, room_id):     # What this function is used for ?
        """
        View for knowing if a room is free or not at the date wanted
        """
        room = get_object_or_404(Room, pk=room_id)
        meeting_list = list(Meeting.objects.order_by('-start_timestamps'))
        date = datetime.datetime(int(request.data["year"]), int(request.data["month"]),
                                 int(request.data["day"]), int(request.data["hour"]),
                                 int(request.data["minute"]))
        if meeting_list:
            count = 0
            meeting = meeting_list[count]
            time_start = datetime.datetime(meeting.start_timestamps.year, meeting.start_timestamps.month,
                                           meeting.start_timestamps.day, meeting.start_timestamps.hour,
                                           meeting.start_timestamps.minute)
            duration = meeting.duration * 30
            end_y, end_mo, end_d, end_h, end_mi = func.shift_date(time_start.year, time_start.month, time_start.day, time_start.hour, time_start.minute, duration)
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
                end_y, end_mo, end_d, end_h, end_mi = func.shift_date(time_start.year, time_start.month, time_start.day, time_start.hour, time_start.minute, duration)
                time_end = datetime.datetime(end_y, end_mo, end_d, end_h, end_mi)
        if (not free) and (time_start > date):
            free = True
        if bool_meeting:
            meeting = meeting.toJSON()
        context = {'room': room.toJSON(),
                   "free": free,
                   "meeting": meeting,
                   "bool_meeting": bool_meeting,
                   "date": date,
                   "day_name": date.strftime("%A"),
                   "month_name": date.strftime("%B")
                   }
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


class UserNextMeetingView(APIView):
    """
    View of the next meeting of a user
    """
    @staticmethod
    def get(request, user_id):
        """
        View of the next meeting of the user 'user_id'
        """
        meeting_list: list[Meeting] = list(Meeting.objects.filter(user=user_id).order_by(
            'start_timestamps'))
        # print("UserNextMeetingView, meeting_list :", meeting_list)
        now = make_aware(datetime.datetime.now())
        if meeting_list and meeting_list[-1].start_timestamps >= now:
            index = 0
            meet = meeting_list[index]
            while meet.start_timestamps < now:
                index += 1
                meet = meeting_list[index]
            time = meet.start_timestamps.strftime("on %A %d of %B %Y, at %H:%M")
            duration = f"{meet.duration // 2} hour(s)"
            # print("UserNextMeetingView, meet :", meet)
            if meet.duration % 2 == 1:
                duration += " and 30 minutes"
            data = f"{meet.title} in {meet.room}, {time} for {duration}"
        else:
            data = "Plus de rendez-vous de prévu"
        # print("UserNextMeetingView, context :", context)
        return Response(data=data)


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


class HandleMeetingView(APIView):
    """
    Meeting handler
    """
    @staticmethod
    def put(request):
        """
        to create a meeting
        """
        data = request.data
        if data["user"] == "":
            print("user rejected")
            context = {"rejected": True, "error": "No user fill in", "warning": None}
        else:
            context = {"rejected": False, "error": None, "warning": None}
            if "physically_present_person" in data.keys():
                physically_present_person = data["physically_present_person"]
            else:
                physically_present_person = None
            if "other_persons" in data.keys():
                other_persons = data["other_persons"]
            else:
                other_persons = None
            # data = {room: int, user: str, date: time, duration: int, title: str} + optionals :
            # {physically_present_person: int, other_persons: str}
            # data["room"] is an int (the room id), data["user"] is a string (the user name)
            room = get_object_or_404(Room, pk=data["room"])
            existing_meetings = list(Meeting.objects.all().filter(room=room.id))
            # TO DO : write a function to test all kind of typing error (here, we just test the spaces
            # at the end of the name) and replace the try/except statement ("hide" would be better
            # than "replace")
            try:
                user = User.objects.get(name=data["user"])
            except User.DoesNotExist:
                name = data["user"]
                while name[-1] == " ":
                    name = name[:-1]
                try:
                    user = User.objects.get(name=name)
                except User.DoesNotExist:
                    context["warning"] = "Le créateur de la réunion n'a pas été trouvé"
                    user = func.create_a_new_user(name, "invited")  # on tablet
                    """try:
                        invited = User.objects.get(name=TYPING_ERROR_USERNAME)
                        user = invited
                    except User.DoesNotExist:
                        user = func.create_a_new_user(TYPING_ERROR_USERNAME, "invited")
                    """
            meeting = func.create_a_new_meeting(room, user, data["date"], data["title"],
                                                data["duration"], physically_present_person,
                                                other_persons)
            meet: Meeting
            for meet in existing_meetings:
                if meeting.check_overlapping(meet):
                    meeting.delete_meeting()
                    context = {"rejected": True, "error": "Two meetings overlap",
                               "warning": meet.slot()}
                    break
            else:
                print("meeting created")
            context["meeting"] = meeting.toJSON()
        return Response(data=context)

    @staticmethod
    def delete(request):
        """
        to delete a meeting
        """
        meet = get_object_or_404(Meeting, pk=request.data["meeting"])
        meet.delete_meeting()
        return Response(data=None)

    @staticmethod
    def patch(request):
        """
        To modify a meeting
        """
        meet = get_object_or_404(Meeting, pk=request.data["meeting"])
        arguments = {}
        for key in ["start_timestamps", "title", "duration", "physically_present_person",
                    "other_persons", "remove_physically_present_person", "remove_other_persons"]:
            if key in request.data.keys():
                arguments[key] = request.data[key]
            else:
                arguments[key] = None
        if "room" in request.data.keys():
            room = get_object_or_404(Room, pk=request.data["room"])
        else:
            room = None
        if "user" in request.data.keys():
            user = get_object_or_404(User, pk=request.data["user"])
        else:
            user = None
        func.modify_a_meeting(meeting=meet, room=room, user=user,
                              start_timestamps=arguments["start_timestamps"], title=arguments["title"],
                              duration=arguments["duration"], other_persons=arguments["other_persons"],
                              physically_present_person=arguments["physically_present_person"],
                              remove_physically_present_person=arguments["remove_physically_present_person"],
                              remove_other_persons=arguments["remove_other_persons"])
        return Response(data=None)


class MeetingListView(APIView):
    """
    View of the meetings list
    """
    @staticmethod
    def get(request):
        """
        For getting the view
        """
        meeting_list: list[Meeting] = list(Meeting.objects.order_by('start_timestamps')[:])
        # meeting_list.reverse()
        context = {
            f"meeting {index}": meet.toJSON() for index, meet in enumerate(meeting_list)
        }
        return Response(data=context)


class RoomListView(APIView):
    """
    View of the room list
    """

    @staticmethod
    def get(request):
        """
        For getting the view
        """
        room_list: list[Room] = list(Room.objects.order_by('-name')[:])
        context = {
            f"room {index}": room.toJSON() for index, room in enumerate(room_list)
        }
        return Response(data=context)


class RoomMeetingsView(APIView):
    """
    View for the meetings of room
    """
    @staticmethod
    def get(request, room_id):
        """
        For getting the view
        """
        meeting_list: list[Meeting] = Meeting.objects.all().filter(room=room_id).order_by("start_timestamps")
        futur_meetings = list(filter(lambda meeting: meeting.start_timestamps >= make_aware(datetime.datetime.now()), meeting_list))
        if futur_meetings:
            next_meeting = futur_meetings[0]
            next_meeting.username = futur_meetings[0].user.name
            next_meeting = next_meeting.toJSON()
        else:
            next_meeting = None
        context = {}
        for index, meet in enumerate(meeting_list):
            meet.username = meet.user.name
            context[f"meeting {index}"] = meet.toJSON()
        context["next_meeting"] = next_meeting

        return Response(data=context)
