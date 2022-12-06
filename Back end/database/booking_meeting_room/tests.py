""" Tests file """

import datetime

from django.test import TestCase
from django.urls import reverse
from django.utils.timezone import make_aware

from .models import Room, User, Meeting
import booking_meeting_room.functions as func


class FunctionsFileTests(TestCase):
    @staticmethod
    def test_days_in_a_month():
        thirty = func.days_in_a_month(2022, 4)
        thirty_one = func.days_in_a_month(2023, 12)
        twenty_eight = func.days_in_a_month(2022, 2)
        twenty_nine = func.days_in_a_month(2024, 2)
        assert thirty == 30
        assert thirty_one == 31
        assert twenty_eight == 28
        assert twenty_nine == 29
        twenty_eight = func.days_in_a_month(2100, 2)
        twenty_nine = func.days_in_a_month(2000, 2)
        assert twenty_eight == 28
        assert twenty_nine == 29

    @staticmethod
    def test_shift_date_positive_shift():
        year, month, day, hour, minute = func.shift_date(2022, 4, 29, 23, 45, 15)
        assert year == 2022
        assert month == 4
        assert day == 30
        assert hour == 0
        assert minute == 0
        year, month, day, hour, minute = func.shift_date(2022, 4, 29, 23, 45, 20 + 60 + 60 * 24 * 2)
        assert year == 2022
        assert month == 5
        assert day == 2
        assert hour == 1
        assert minute == 5
        year, month, day, hour, minute = func.shift_date(2022, 12, 31, 23, 45, 20)
        assert year == 2023
        assert month == 1
        assert day == 1
        assert hour == 0
        assert minute == 5

    @staticmethod
    def test_shift_date_negative_shift():
        year, month, day, hour, minute = func.shift_date(2022, 4, 29, 23, 5, -15)
        assert year == 2022
        assert month == 4
        assert day == 29
        assert hour == 22
        assert minute == 50
        year, month, day, hour, minute = func.shift_date(2022, 4, 1, 1, 5, - 10 - 60 - 60 * 24 * 2)
        assert year == 2022
        assert month == 3
        assert day == 29
        assert hour == 23
        assert minute == 55
        year, month, day, hour, minute = func.shift_date(2022, 1, 1, 0, 5, - 10)
        assert year == 2021
        assert month == 12
        assert day == 31
        assert hour == 23
        assert minute == 55

    @staticmethod  # TO DO
    def test_create_a_new_user():
        user = func.create_a_new_user("a user", "staff")
        assert user is not None
        assert user in User.objects.all()
        assert user.status == "staff"
        assert user.name == "a user"

    @staticmethod  # TO DO
    def test_create_a_new_room():
        room1 = func.create_a_new_room("name", "location", "picture", videoconference=False,
                                       television_screen=False, projector=False, paperboard=False,
                                       whiteboard=False, wall_whiteboard=False, computer=True,
                                       capacity=2, lab_validation=True)
        room2 = func.create_a_new_room("name2", "location", "picture", videoconference=False,
                                       television_screen=False, projector=False, paperboard=False,
                                       whiteboard=False, wall_whiteboard=False, computer=True)
        assert room1 is not None
        assert room1 in Room.objects.all()
        assert room1.capacity == 2
        assert room1.name == "name"
        assert room1.location == "location"
        assert room1.picture == "picture"
        assert not (room1.videoconference or room1.television_screen or room1.projector)
        assert not (room1.paperboard or room1.whiteboard or room1.wall_whiteboard)
        assert (room1.lab_validation and room1.computer)
        assert room2 is not None
        assert room2 in Room.objects.all()
        assert room2.capacity == 1
        assert room2.name == "name2"
        assert room2.location == "location"
        assert room2.picture == "picture"
        assert not (room2.videoconference or room2.television_screen or room2.projector)
        assert not (room2.paperboard or room2.whiteboard or room2.wall_whiteboard)
        assert (not room2.lab_validation and room2.computer)

    @staticmethod
    def test_create_a_new_meeting_default():
        meet = func.create_a_new_meeting(
            func.create_a_new_room("name", "location", "picture", videoconference=False,
                                   television_screen=False, projector=False, paperboard=False,
                                   whiteboard=False, wall_whiteboard=False, computer=False),
            func.create_a_new_user("a user", "staff"), make_aware(datetime.datetime(2022, 3, 5)), "title")
        assert meet is not None
        assert meet in Meeting.objects.all()
        assert meet.duration == 1
        assert meet.other_persons is meet.physically_present_person is None

    @staticmethod
    def test_create_a_new_meeting_all_parameter():
        meet = func.create_a_new_meeting(
            func.create_a_new_room("name", "location", "picture", videoconference=False,
                                   television_screen=False, projector=False, paperboard=False,
                                   whiteboard=False, wall_whiteboard=False, computer=False),
            func.create_a_new_user("a user", "staff"), make_aware(datetime.datetime(2022, 3, 5)), "title",
            duration=2, other_persons="other", physically_present_person=4)
        assert meet is not None
        assert meet in Meeting.objects.all()
        assert meet.duration == 2
        assert meet.other_persons == "other"
        assert meet.physically_present_person == 4

    @staticmethod
    def test_modify_a_meeting_modifying():
        meet = func.create_a_new_meeting(
            func.create_a_new_room("name", "location", "picture", videoconference=False,
                                   television_screen=False, projector=False, paperboard=False,
                                   whiteboard=False, wall_whiteboard=False, computer=False),
            func.create_a_new_user("a user", "staff"), make_aware(datetime.datetime(2022, 3, 5)), "title")
        func.modify_a_meeting(meet, duration=3)
        assert Meeting.objects.get(id=meet.id).duration == 3
        assert Meeting.objects.get(id=meet.id).title == "title"
        func.modify_a_meeting(meet, start_timestamps=make_aware(datetime.datetime(2022, 3, 6, 13, 30)),
                              title="another title", duration=4, physically_present_person=4,
                              other_persons="others")
        modified_meeting = Meeting.objects.get(id=meet.id)
        assert modified_meeting.duration == 4
        assert modified_meeting.title == "another title"
        assert modified_meeting.start_timestamps == make_aware(datetime.datetime(2022, 3, 6, 13, 30))
        assert modified_meeting.other_persons == "others"
        assert modified_meeting.physically_present_person == 4

    @staticmethod
    def test_modify_a_meeting_deleting():
        meet = func.create_a_new_meeting(
            func.create_a_new_room("name", "location", "picture", videoconference=False,
                                   television_screen=False, projector=False, paperboard=False,
                                   whiteboard=False, wall_whiteboard=False, computer=False),
            func.create_a_new_user("a user", "staff"), make_aware(datetime.datetime(2022, 3, 5)), "title",
            duration=2, other_persons="other", physically_present_person=4)
        func.modify_a_meeting(meet, remove_other_persons=True, remove_physically_present_person=True)
        modified_meeting = Meeting.objects.get(id=meet.id)
        assert modified_meeting.other_persons is None
        assert modified_meeting.physically_present_person is None
        assert modified_meeting.duration == 2
        assert modified_meeting.title == "title"

    @staticmethod
    def test_modify_a_meeting_delete_and_modify():
        meet = func.create_a_new_meeting(
            func.create_a_new_room("name", "location", "picture", videoconference=False,
                                   television_screen=False, projector=False, paperboard=False,
                                   whiteboard=False, wall_whiteboard=False, computer=False),
            func.create_a_new_user("a user", "staff"), make_aware(datetime.datetime(2022, 3, 5)), "title",
            duration=2, other_persons="other", physically_present_person=4)
        func.modify_a_meeting(meet, start_timestamps=make_aware(datetime.datetime(2022, 4, 6, 18, 45)),
                              title="another title", remove_other_persons=True,
                              physically_present_person=3)
        modified_meeting = Meeting.objects.get(id=meet.id)
        assert modified_meeting.other_persons is None
        assert modified_meeting.physically_present_person == 3
        assert modified_meeting.duration == 2
        assert modified_meeting.title == "another title"


class RoomModelTests(TestCase):

    @staticmethod
    def test_str():
        room = func.create_a_new_room(capacity=2, name="a room", location="9ème étage",
                                      picture="an image", lab_validation=False, videoconference=False,
                                      television_screen=False, projector=False, paperboard=False,
                                      whiteboard=False, wall_whiteboard=False, computer=True)
        assert str(room) == "a room"

    @staticmethod
    def test_assets():
        room = func.create_a_new_room(capacity=2, name="a room", location="9ème étage",
                                      picture="an image", lab_validation=True, videoconference=True,
                                      television_screen=False, projector=False, paperboard=False,
                                      whiteboard=False, wall_whiteboard=False, computer=True)
        tested = room.assets()
        assert tested == {"lab_validation": True,
                          "videoconference": True,
                          "television_screen": False,
                          "projector": False,
                          "paperboard": False,
                          "whiteboard": False,
                          "wall_whiteboard": False,
                          "computer": True}

    @staticmethod
    def test_assets_default():
        room = Room(capacity=2, name="a room", location="9ème étage", picture="an image",
                    videoconference=True, television_screen=False, projector=False, paperboard=False,
                    whiteboard=False, wall_whiteboard=False, computer=True)
        tested = room.assets()
        assert tested == {"lab_validation": False,
                          "videoconference": True,
                          "television_screen": False,
                          "projector": False,
                          "paperboard": False,
                          "whiteboard": False,
                          "wall_whiteboard": False,
                          "computer": True}


class UserModelTests(TestCase):

    @staticmethod
    def test_str():
        user = func.create_a_new_user("a user", "staff")
        assert str(user) == "a user"


class MeetingModelTests(TestCase):
    # TO DO : slot
    @staticmethod
    def test_str():
        room = func.create_a_new_room("a room", "9ème étage", "an image", False, False, False, False,
                                      False, False, True, 2, False)
        user = func.create_a_new_user("a user", "staff")
        meeting = func.create_a_new_meeting(room, user,
                                            make_aware(datetime.datetime(2022, 3, 10, 10, 30)),
                                            "a meeting", 2)
        assert str(meeting) == "a meeting in a room, by a user"

    @staticmethod
    def test_modify_one_thing():
        room = func.create_a_new_room("a room", "9ème étage", "an image", False, False, False, False,
                                      False, False, True, 2, False)
        user = func.create_a_new_user("a user", "staff")
        meeting = func.create_a_new_meeting(room, user,
                                            make_aware(datetime.datetime(2022, 3, 10, 10, 30)),
                                            "a meeting", 2)
        meeting.modify(title="new name")
        assert Meeting.objects.get(id=meeting.id).title == "new name"
        assert Meeting.objects.get(id=meeting.id).duration == 2
        meeting.modify(duration=1)
        assert Meeting.objects.get(id=meeting.id).duration == 1
        assert Meeting.objects.get(id=meeting.id).title == "new name"
        meeting.modify(other_persons="new people")
        assert Meeting.objects.get(id=meeting.id).other_persons == "new people"
        meeting.modify(title="better title")
        assert Meeting.objects.get(id=meeting.id).title == "better title"
        assert Meeting.objects.get(id=meeting.id).duration == 1

    @staticmethod
    def test_modify_everything():
        room = func.create_a_new_room("a room", "9ème étage", "an image", False, False, False, False,
                                      False, False, True, 2, False)
        user = func.create_a_new_user("a user", "staff")
        meeting = func.create_a_new_meeting(room, user,
                                            make_aware(datetime.datetime(2022, 3, 10, 10, 30)),
                                            "a meeting", 2)
        meeting.modify(room=func.create_a_new_room("another room", "9ème étage", "another image",
                                                   True, False, True, False, False, False, True, 4),
                       user=func.create_a_new_user("other person", "not staff"), title="new name",
                       start_timestamps=make_aware(datetime.datetime(2022, 3, 10, 11, 0)), duration=1,
                       physically_present_person=3, other_persons="Hello")
        modified_meeting = Meeting.objects.get(id=meeting.id)
        assert modified_meeting.room.name == "another room"
        assert modified_meeting.room.assets() == {"lab_validation": False,
                                                  "videoconference": True,
                                                  "television_screen": False,
                                                  "projector": True,
                                                  "paperboard": False,
                                                  "whiteboard": False,
                                                  "wall_whiteboard": False,
                                                  "computer": True}
        assert modified_meeting.room.picture == "another image"
        assert modified_meeting.room.capacity == 4
        assert modified_meeting.user.name == "other person"
        assert modified_meeting.user.status == "not staff"
        assert modified_meeting.title == "new name"
        assert modified_meeting.start_timestamps == make_aware(datetime.datetime(2022, 3, 10, 11, 0, 0))
        assert modified_meeting.duration == 1
        assert modified_meeting.physically_present_person == 3
        assert modified_meeting.other_persons == "Hello"

    @staticmethod
    def test_delete_meeting():
        room = func.create_a_new_room("a room", "9ème étage", "an image", False, False, False, False,
                                      False, False, True, 2, False)
        user = func.create_a_new_user("a user", "staff")
        meeting = func.create_a_new_meeting(room, user,
                                            make_aware(datetime.datetime(2022, 3, 10, 10, 30)),
                                            "a meeting", 2)
        meeting.delete_meeting()
        assert meeting not in Meeting.objects.all()

    @staticmethod
    def test_remove_attribute():
        room = func.create_a_new_room("a room", "9ème étage", "an image", False, False, False, False,
                                      False, False, True, 2, False)
        user = func.create_a_new_user("a user", "staff")
        meeting = func.create_a_new_meeting(room, user,
                                            make_aware(datetime.datetime(2022, 3, 10, 10, 30)),
                                            "a meeting", 2)
        meeting.modify(physically_present_person=3, other_persons="Hello")
        assert meeting.physically_present_person == 3
        assert meeting.other_persons == "Hello"
        meeting.remove_attribute(physically_present_person=True)
        modified_meeting = Meeting.objects.get(id=meeting.id)
        assert modified_meeting.physically_present_person is None
        assert modified_meeting.other_persons == "Hello"
        meeting.remove_attribute(other_persons=True)
        modified_meeting = Meeting.objects.get(id=meeting.id)
        assert modified_meeting.physically_present_person is None
        assert modified_meeting.other_persons is None
        meeting.modify(physically_present_person=3, other_persons="Hello")
        meeting.remove_attribute(other_persons=True, physically_present_person=True)
        modified_meeting = Meeting.objects.get(id=meeting.id)
        assert modified_meeting.physically_present_person is None
        assert modified_meeting.other_persons is None

    @staticmethod
    def test_slot():
        pass

    @staticmethod
    def test_check_overlapping_slots():
        room = func.create_a_new_room(name="a room", location="9ème étage", picture="an image",
                                      videoconference=False, television_screen=False,
                                      projector=False, paperboard=False, whiteboard=False,
                                      wall_whiteboard=False, computer=True, capacity=2,)
        user = func.create_a_new_user(name="a user", status="staff")
        meeting1 = func.create_a_new_meeting(room=room, user=user,
                                             start_timestamps=make_aware(datetime.datetime(2022, 3,
                                                                                           10, 10, 30)),
                                             title="meeting1", duration=5)
        meeting2 = func.create_a_new_meeting(room=room, user=user,
                                             start_timestamps=make_aware(datetime.datetime(2022, 3,
                                                                                           10, 10, 0)),
                                             title="meeting2", duration=2)
        meeting3 = func.create_a_new_meeting(room=room, user=user,
                                             start_timestamps=make_aware(datetime.datetime(2022, 3,
                                                                                           10, 11, 0)),
                                             title="meeting3", duration=2)
        meeting4 = func.create_a_new_meeting(room=room, user=user,
                                             start_timestamps=make_aware(datetime.datetime(2022, 3,
                                                                                           10, 12, 0)),
                                             title="meeting3", duration=2)
        assert meeting1.check_overlapping(meeting2)
        assert meeting2.check_overlapping(meeting1)
        assert meeting1.check_overlapping(meeting3)
        assert meeting3.check_overlapping(meeting1)
        assert not meeting3.check_overlapping(meeting2)
        assert not meeting2.check_overlapping(meeting3)
        assert meeting1.check_overlapping(meeting4)
        assert meeting4.check_overlapping(meeting1)
        assert not meeting4.check_overlapping(meeting2)
        assert not meeting2.check_overlapping(meeting4)

    @staticmethod
    def test_check_overlapping_different_rooms():
        room1 = func.create_a_new_room(name="first room", location="9ème étage", picture="an image",
                                       videoconference=False, television_screen=False,
                                       projector=False, paperboard=False, whiteboard=False,
                                       wall_whiteboard=False, computer=True, capacity=2)
        room2 = func.create_a_new_room(name="second room", location="9ème étage", picture="an image",
                                       videoconference=False, television_screen=False,
                                       projector=False, paperboard=True, whiteboard=False,
                                       wall_whiteboard=False, computer=True, capacity=5)
        user = func.create_a_new_user(name="a user", status="staff")
        meeting1 = func.create_a_new_meeting(room=room1, user=user,
                                             start_timestamps=make_aware(datetime.datetime(2022, 3,
                                                                                           10, 10, 30)),
                                             title="meeting1", duration=3)
        meeting2 = func.create_a_new_meeting(room=room2, user=user,
                                             start_timestamps=make_aware(datetime.datetime(2022, 3,
                                                                                           10, 10, 0)),
                                             title="meeting2", duration=6)
        meeting3 = func.create_a_new_meeting(room=room2, user=user,
                                             start_timestamps=make_aware(datetime.datetime(2022, 3,
                                                                                           10, 11, 0)),
                                             title="meeting3", duration=3)
        meeting4 = func.create_a_new_meeting(room=room1, user=user,
                                             start_timestamps=make_aware(datetime.datetime(2022, 3,
                                                                                           10, 12, 0)),
                                             title="meeting3", duration=2)
        assert not meeting1.check_overlapping(meeting2)
        assert not meeting2.check_overlapping(meeting1)
        assert not meeting1.check_overlapping(meeting3)
        assert not meeting3.check_overlapping(meeting1)
        assert meeting3.check_overlapping(meeting2)
        assert meeting2.check_overlapping(meeting3)
        assert not meeting1.check_overlapping(meeting4)
        assert not meeting4.check_overlapping(meeting1)
        assert not meeting4.check_overlapping(meeting2)
        assert not meeting2.check_overlapping(meeting4)
        assert not meeting4.check_overlapping(meeting3)
        assert not meeting3.check_overlapping(meeting4)


class IndexViewTests(TestCase):
    pass


class RoomViewTests(TestCase):
    def test_get_nonexistent_room_id(self):
        response = self.client.get(reverse("booking_meeting_room:room_view", args=(1, )))
        self.assertEqual(response.status_code, 404)

    def test_get_existent_room_id(self):
        room = func.create_a_new_room("a room", "8eme etage", "a picture", True, False, False, False,
                                      True, False, True, 3)
        response = self.client.get(reverse(f"booking_meeting_room:room_view", args=(room.pk, )))
        self.assertEqual(response.status_code, 200)
        assert '"computer": true' in response.data["room"]
        assert '"lab_validation": false' in response.data["room"]
        assert '"paperboard": false' in response.data["room"]
        assert '"projector": false' in response.data["room"]
        assert '"television_screen": false' in response.data["room"]
        assert '"videoconference": true' in response.data["room"]
        assert '"wall_whiteboard": false' in response.data["room"]
        assert '"whiteboard": true' in response.data["room"]
        self.assertContains(response, room.name)
        self.assertContains(response, room.capacity)
        self.assertContains(response, room.location)

    def test_post_no_meeting(self):
        room = func.create_a_new_room("a room", "8ème étage", "a picture", True, False, False, False,
                                      True, False, True, 3)
        response = self.client.post(
            reverse("booking_meeting_room:room_view", args=(room.id, )),
            {"year": 2022, "month": 12, "day": 29, "hour": 23, "minute": 56})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["meeting"], "No meeting scheduled")
        self.assertEqual(response.data["free"], True)
        assert '"name": "a room"' in response.data["room"]

    def test_post_occupied_room(self):
        room = func.create_a_new_room("a room", "8ème étage", "a picture", True, False, False, False,
                                      True, False, True, 3)
        func.create_a_new_meeting(room, func.create_a_new_user("user", "staff"),
                                  make_aware(datetime.datetime(2022, 9, 12, 15, 10)), "a meeting", 2)
        response = self.client.post(
            reverse("booking_meeting_room:room_view", args=(room.id, )),
            {"year": 2022, "month": 9, "day": 12, "hour": 15, "minute": 56})
        self.assertEqual(response.status_code, 200)
        assert '"title": "a meeting"' in response.data["meeting"]
        self.assertEqual(response.data["free"], False)
        assert '"name": "a room"' in response.data["room"]

    def test_post_free_room(self):
        room = func.create_a_new_room("a room", "8ème étage", "a picture", True, False, False, False,
                                      True, False, True, 3)
        func.create_a_new_meeting(room, func.create_a_new_user("user", "staff"),
                                  make_aware(datetime.datetime(2022, 9, 10, 15, 10)), "a meeting", 2)
        func.create_a_new_meeting(room, func.create_a_new_user("user", "staff"),
                                  make_aware(datetime.datetime(2022, 9, 12, 16, 0)), "a meeting", 2)
        response = self.client.post(
            reverse("booking_meeting_room:room_view", args=(room.id, )),
            {"year": 2022, "month": 9, "day": 12, "hour": 15, "minute": 59})
        self.assertEqual(response.status_code, 200)
        assert '"title": "a meeting"' in response.data["meeting"]
        self.assertEqual(response.data["free"], True)
        assert '"name": "a room"' in response.data["room"]


class UserViewTests(TestCase):
    def test_nonexistent_user_id(self):
        response = self.client.get(reverse("booking_meeting_room:user_view", args=(1, )))
        self.assertEqual(response.status_code, 404)

    def test_existent_user_id(self):
        user = func.create_a_new_user("a user", "staff")
        response = self.client.get(reverse(f"booking_meeting_room:user_view", args=(user.id,)))
        self.assertEqual(response.status_code, 200)
        assert f'"name": "{user.name}"' in response.data["user"]
        assert f'"status": "{user.status}"' in response.data["user"]


class MeetingViewTests(TestCase):
    def test_nonexistent_meeting_id(self):
        response = self.client.get(reverse("booking_meeting_room:meeting_view", args=(1,)))
        self.assertEqual(response.status_code, 404)

    def test_existent_meeting_id(self):
        room = func.create_a_new_room("a room", "9ème étage", "an image", False, False, False, False,
                                      False, False, True, 2, False)
        user = func.create_a_new_user("a user", "staff")
        meeting = func.create_a_new_meeting(room, user,
                                            make_aware(datetime.datetime(2022, 9, 23, 2, 45)),
                                            "a meeting", 2)
        response = self.client.get(reverse(f"booking_meeting_room:meeting_view", args=(meeting.id,)))
        self.assertEqual(response.status_code, 200)
        assert f'"title": "{meeting.title}"' in response.data["meeting"]
        assert f'"room_id": {room.id}' in response.data["meeting"]
        assert f'"user_id": {user.id}' in response.data["meeting"]
        assert f'"duration": {meeting.duration}' in response.data["meeting"]
        assert '"start_timestamps": "2022-09-23T02:45:00.000000Z"' in response.data["meeting"]


class HandleMeetingViewTests(TestCase):
    def test_create_a_meeting(self):
        room = func.create_a_new_room("a room", "9eme etage", "an image", False, False, False, False,
                                      False, False, True, 2)
        user = func.create_a_new_user("a user", "staff")
        title = "a title"
        assert not Meeting.objects.all()
        response = self.client.put(reverse("booking_meeting_room:handle_meeting_view"),
                                   {"room": room.id, "user": user.name, "duration": 2,
                                    "title": title, "physically_present_person": None,
                                    "date": make_aware(datetime.datetime(2022, 10, 15, 9, 30)),
                                    "other_persons": None}, content_type="application/json")
        self.assertEqual(response.status_code, 200)
        assert Meeting.objects.all()
        assert type(Meeting.objects.all()[0]) == Meeting
        assert str(Meeting.objects.all()[0]) == f"{title} in {room.name}, by {user.name}"

    def test_delete_a_meeting(self):
        room = func.create_a_new_room("a room", "9eme etage", "an image", False, False, False, False,
                                      False, False, True, 2)
        user = func.create_a_new_user("a user", "staff")
        meeting = func.create_a_new_meeting(room, user,
                                            make_aware(datetime.datetime(2022, 9, 23, 2, 45)),
                                            "a meeting", 2)
        response = self.client.delete(reverse("booking_meeting_room:handle_meeting_view"),
                                      {"meeting": meeting.id}, content_type="application/json")
        self.assertEqual(response.status_code, 200)
        assert not Meeting.objects.all()

    def test_patch_a_meeting(self):
        room = func.create_a_new_room("a room", "9eme etage", "an image", False, False, False, False,
                                      False, False, True, 2)
        user = func.create_a_new_user("a user", "staff")
        title = "new title"
        meeting = func.create_a_new_meeting(room, user,
                                            make_aware(datetime.datetime(2022, 9, 23, 2, 45)),
                                            "a meeting", 2)
        response = self.client.patch(reverse("booking_meeting_room:handle_meeting_view"),
                                     {"duration": 3, "title": title, "physically_present_person": 2,
                                      "start_timestamps": make_aware(datetime.datetime(2022, 10, 15, 9, 30)),
                                      "other_persons": "Jean", "meeting": meeting.id},
                                     content_type="application/json")
        self.assertEqual(response.status_code, 200)
        new_meeting: Meeting = Meeting.objects.all()[0]
        assert str(new_meeting) == f"{title} in {room.name}, by {user.name}"
        assert new_meeting.room.id == room.id
        assert new_meeting.user.id == user.id
        assert new_meeting.duration == 3
        assert new_meeting.start_timestamps == make_aware(datetime.datetime(2022, 10, 15, 9, 30))
        assert new_meeting.other_persons == "Jean"
        assert new_meeting.physically_present_person == 2


class MeetingListViewTests(TestCase):
    def test_no_meeting_existent(self):
        response = self.client.get(reverse("booking_meeting_room:meeting_list_view"))
        self.assertEqual(response.status_code, 200)
        assert len(response.data) == 0

    def test_with_meeting(self):
        room = func.create_a_new_room("a room", "9eme etage", "an image", False, False, False, False,
                                      False, False, True, 2)
        user = func.create_a_new_user("a user", "staff")
        meeting1 = func.create_a_new_meeting(room, user,
                                             make_aware(datetime.datetime(2022, 9, 23, 2, 45)),
                                             "first meeting", 2)
        meeting2 = func.create_a_new_meeting(room, user,
                                             make_aware(datetime.datetime(2022, 9, 23, 5, 45)),
                                             "second meeting", 1)
        meeting3 = func.create_a_new_meeting(room, user,
                                             make_aware(datetime.datetime(2022, 9, 23, 6, 45)),
                                             "third meeting", 2)
        meeting4 = func.create_a_new_meeting(room, user,
                                             make_aware(datetime.datetime(2022, 9, 14, 10, 45)),
                                             "fourth meeting", 3)
        response = self.client.get(reverse("booking_meeting_room:meeting_list_view"))
        self.assertEqual(response.status_code, 200)
        assert f'"title": "{meeting4.title}"' in response.data["meeting 0"]
        assert '"title": "first meeting"' in response.data["meeting 1"]
        assert '"title": "second meeting"' in response.data["meeting 2"]
        assert f'"title": "{meeting3.title}"' in response.data["meeting 3"]
        assert '"start_timestamps": "2022-09-14T10:45:00.000000Z"' in response.data["meeting 0"]
        assert f'"user_id": {meeting1.user.id}' in response.data["meeting 1"]
        assert f'"room_id": {meeting2.room.id}' in response.data["meeting 2"]


class RoomListViewTests(TestCase):
    def test_no_room_existent(self):
        response = self.client.get(reverse("booking_meeting_room:room_list_view"))
        self.assertEqual(response.status_code, 200)
        assert len(response.data) == 0

    def test_with_room(self):
        room1 = func.create_a_new_room("a room", "9eme etage", "an image 1", False, False, False, False,
                                       False, False, True, 2)
        room2 = func.create_a_new_room("another room", "9eme etage", "an image 2", False, False, True,
                                       False, False, False, True, 2)
        room3 = func.create_a_new_room("a third room", "8eme etage", "an image 3", False, True, False,
                                       True, False, True, False, 6)
        room4 = func.create_a_new_room("huge room", "9eme etage", "an image 4", True, True, False,
                                       False, False, False, False, 8, True)
        response = self.client.get(reverse("booking_meeting_room:room_list_view"))
        self.assertEqual(response.status_code, 200)
        assert f'"name": "{room4.name}"' in response.data["room 0"]
        assert '"name": "another room"' in response.data["room 1"]
        assert '"name": "a third room"' in response.data["room 2"]
        assert f'"name": "{room1.name}"' in response.data["room 3"]
        assert '"location": "9eme etage"' in response.data["room 0"]
        assert f'"computer": {str(room2.computer).lower()}' in response.data["room 1"]
        assert f'"paperboard": {str(room3.paperboard).lower()}' in response.data["room 2"]


class RoomMeetingsViewTests(TestCase):
    def test_nonexistent_room_id(self):
        response = self.client.get(reverse("booking_meeting_room:room_meetings", args=(1, )))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {"next_meeting": None})

    def test_existent_room_id_but_no_meeting(self):
        room = func.create_a_new_room("a room", "8eme etage", "a picture", True, False, False, False,
                                      True, False, True, 3)
        response = self.client.get(reverse(f"booking_meeting_room:room_meetings", args=(room.pk, )))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {"next_meeting": None})

    def test_existent_room_id_with_meetings(self):
        room = func.create_a_new_room("a room", "8eme etage", "a picture", True, False, False, False,
                                      True, False, True, 3)
        user = func.create_a_new_user("a user", "staff")
        meeting0 = func.create_a_new_meeting(room, user,
                                             make_aware(datetime.datetime(2022, 9, 23, 2, 45)),
                                             "a meeting", 2)
        meeting1 = func.create_a_new_meeting(room, user,
                                             make_aware(datetime.datetime(2022, 12, 30, 2, 45)),
                                             "another meeting", 2)
        response = self.client.get(reverse(f"booking_meeting_room:room_meetings", args=(room.pk, )))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, meeting0.duration)
        self.assertContains(response, meeting1.title)


class UserNextMeetingViewTests(TestCase):
    def test_no_futur_meeting(self):
        user = func.create_a_new_user("a user", "staff")
        response = self.client.get(reverse("booking_meeting_room:user_next_meeting_view",
                                           args=(user.id, )))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Plus de rendez-vous de prévu")

    def test_with_only_futur_meeting(self):
        room = func.create_a_new_room("a room", "9eme etage", "an image", False, False, False, False,
                                      False, False, True, 2)
        user = func.create_a_new_user("a user", "staff")
        now = make_aware(datetime.datetime.now())
        end_y, end_mo, end_d, end_h, end_mi = func.shift_date(now.year, now.month, now.day, now.hour,
                                                              now.minute, 60)
        now1h = make_aware(datetime.datetime(end_y, end_mo, end_d, end_h, end_mi))
        end_y, end_mo, end_d, end_h, end_mi = func.shift_date(now.year, now.month, now.day, now.hour,
                                                              now.minute, 60*24)
        now1d = make_aware(datetime.datetime(end_y, end_mo, end_d, end_h, end_mi))
        end_y, end_mo, end_d, end_h, end_mi = func.shift_date(now.year, now.month, now.day, now.hour,
                                                              now.minute, 3*60)
        now3h = make_aware(datetime.datetime(end_y, end_mo, end_d, end_h, end_mi))
        meeting = func.create_a_new_meeting(room, user, now1h, "a meeting", 3)
        meeting2 = func.create_a_new_meeting(room, user, now1d, "another meeting", 4)
        meeting3 = func.create_a_new_meeting(room, user, now3h, "second meeting", 2)
        response = self.client.get(reverse("booking_meeting_room:user_next_meeting_view",
                                           args=(user.id,)))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "a meeting")
        self.assertContains(response, meeting.duration)
        self.assertNotContains(response, meeting2.title)
        self.assertNotContains(response, meeting3.title)
        assert f'{now1h.strftime("on %A %d of %B %Y, at %H:%M")} for 1 hour(s) and 30 minutes' \
               in response.data

    def test_with_only_past_meeting(self):
        room = func.create_a_new_room("a room", "9eme etage", "an image", False, False, False, False,
                                      False, False, True, 2)
        user = func.create_a_new_user("a user", "staff")
        now = make_aware(datetime.datetime.now())
        end_y, end_mo, end_d, end_h, end_mi = func.shift_date(now.year, now.month, now.day, now.hour,
                                                              now.minute, -60)
        now_m1h = make_aware(datetime.datetime(end_y, end_mo, end_d, end_h, end_mi))
        end_y, end_mo, end_d, end_h, end_mi = func.shift_date(now.year, now.month, now.day, now.hour,
                                                              now.minute, - 60 * 24)
        now_m1d = make_aware(datetime.datetime(end_y, end_mo, end_d, end_h, end_mi))
        end_y, end_mo, end_d, end_h, end_mi = func.shift_date(now.year, now.month, now.day, now.hour,
                                                              now.minute, - 3 * 60)
        now_m3h = make_aware(datetime.datetime(end_y, end_mo, end_d, end_h, end_mi))
        meeting = func.create_a_new_meeting(room, user, now_m1h, "a meeting", 3)
        meeting2 = func.create_a_new_meeting(room, user, now_m1d, "another meeting", 4)
        meeting3 = func.create_a_new_meeting(room, user, now_m3h, "second meeting", 2)
        response = self.client.get(reverse("booking_meeting_room:user_next_meeting_view",
                                           args=(user.id,)))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Plus de rendez-vous de prévu")
        self.assertNotContains(response, meeting)
        self.assertNotContains(response, meeting2)
        self.assertNotContains(response, meeting3)

    def test_with_past_and_futur_meeting(self):
        room = func.create_a_new_room("a room", "9eme etage", "an image", False, False, False, False,
                                      False, False, True, 2)
        user = func.create_a_new_user("a user", "staff")
        now = make_aware(datetime.datetime.now())
        end_y, end_mo, end_d, end_h, end_mi = func.shift_date(now.year, now.month, now.day, now.hour,
                                                              now.minute, 60)
        now1h = make_aware(datetime.datetime(end_y, end_mo, end_d, end_h, end_mi))
        end_y, end_mo, end_d, end_h, end_mi = func.shift_date(now.year, now.month, now.day, now.hour,
                                                              now.minute, 60*24)
        now1d = make_aware(datetime.datetime(end_y, end_mo, end_d, end_h, end_mi))
        now_m1y = make_aware(datetime.datetime(now.year - 1, now.month, now.day, now.hour, now.minute))
        meeting = func.create_a_new_meeting(room, user, now1h, "a meeting", 3)
        meeting2 = func.create_a_new_meeting(room, user, now1d, "another meeting", 4)
        meeting3 = func.create_a_new_meeting(room, user, now_m1y, "second meeting", 2)
        response = self.client.get(reverse("booking_meeting_room:user_next_meeting_view",
                                           args=(user.id,)))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "a meeting")
        self.assertContains(response, meeting.duration)
        self.assertNotContains(response, meeting2.title)
        self.assertNotContains(response, meeting3.title)
        assert f'{now1h.strftime("on %A %d of %B %Y, at %H:%M")} for 1 hour(s) and 30 minutes' \
               in response.data

    def test_with_several_users(self):
        room = func.create_a_new_room("a room", "9eme etage", "an image", False, False, False, False,
                                      False, False, True, 2)
        room2 = func.create_a_new_room("a second room", "9eme etage", "an image", False, False, False,
                                       False, False, False, True, 2)
        room3 = func.create_a_new_room("a third room", "9eme etage", "an image", False, False, False,
                                       False, False, False, True, 2)
        user = func.create_a_new_user("a user", "staff")
        user2 = func.create_a_new_user("another user", "staff")
        user3 = func.create_a_new_user("a third user", "consultant")
        now = make_aware(datetime.datetime.now())
        end_y, end_mo, end_d, end_h, end_mi = func.shift_date(now.year, now.month, now.day, now.hour,
                                                              now.minute, 60)
        now1h = make_aware(datetime.datetime(end_y, end_mo, end_d, end_h, end_mi))
        end_y, end_mo, end_d, end_h, end_mi = func.shift_date(now.year, now.month, now.day, now.hour,
                                                              now.minute, -60)
        now_m1h = make_aware(datetime.datetime(end_y, end_mo, end_d, end_h, end_mi))
        end_y, end_mo, end_d, end_h, end_mi = func.shift_date(now.year, now.month, now.day, now.hour,
                                                              now.minute, 60*24)
        now1d = make_aware(datetime.datetime(end_y, end_mo, end_d, end_h, end_mi))
        now_m1y = make_aware(datetime.datetime(now.year - 1, now.month, now.day, now.hour, now.minute))
        meeting = func.create_a_new_meeting(room, user, now1h, "a meeting", 3)
        meeting2 = func.create_a_new_meeting(room, user, now1d, "second meeting", 4)
        meeting3 = func.create_a_new_meeting(room, user, now_m1y, "third meeting", 2)
        meeting4 = func.create_a_new_meeting(room, user, now_m1h, "fourth meeting", 1)
        meeting5 = func.create_a_new_meeting(room2, user2, now1h, "another meeting", 4)
        meeting6 = func.create_a_new_meeting(room2, user2, now_m1h, "new user meeting", 2)
        meeting7 = func.create_a_new_meeting(room2, user2, now1d, "a meeting for user 2", 3)
        meeting8 = func.create_a_new_meeting(room2, user2, now_m1y, "last second user meeting", 4)
        meeting9 = func.create_a_new_meeting(room3, user3, now1h, "third user meeting", 4)
        meeting10 = func.create_a_new_meeting(room3, user3, now_m1h, "meeting for user 3", 2)
        meeting11 = func.create_a_new_meeting(room3, user3, now1d, "a user3 meeting", 3)
        meeting12 = func.create_a_new_meeting(room3, user3, now_m1y, "last meeting", 4)
        response = self.client.get(reverse("booking_meeting_room:user_next_meeting_view",
                                           args=(user.id,)))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "a meeting")
        self.assertContains(response, meeting.duration)
        self.assertNotContains(response, meeting2.title)
        self.assertNotContains(response, meeting3.title)
        self.assertNotContains(response, meeting4.title)
        self.assertNotContains(response, meeting5.title)
        self.assertNotContains(response, meeting6.title)
        self.assertNotContains(response, meeting7.title)
        self.assertNotContains(response, meeting8.title)
        self.assertNotContains(response, meeting9.title)
        self.assertNotContains(response, meeting10.title)
        self.assertNotContains(response, meeting11.title)
        self.assertNotContains(response, meeting12.title)
        assert f'{now1h.strftime("on %A %d of %B %Y, at %H:%M")} for 1 hour(s) and 30 minutes' \
               in response.data
