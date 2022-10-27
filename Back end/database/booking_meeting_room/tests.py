""" Tests file """

import datetime
from django.test import TestCase
from django.urls import reverse
from django.utils.timezone import make_aware

from .models import Room, User, Meeting
import booking_meeting_room.functions as func


def create_room(capacity, name, location, picture, videoconference, television_screen, projector,
                paperboard, whiteboard, wall_whiteboard, computer, lab_validation=False):
    """
    @param capacity: int
    @param name: str
    @param location: str
    @param picture: str
    @param videoconference: bool
    @param television_screen: bool
    @param projector: bool
    @param paperboard: bool
    @param whiteboard: bool
    @param wall_whiteboard: bool
    @param computer: bool
    @param lab_validation: bool (optional)
    @return: Room
    """
    return Room.objects.create(capacity=capacity, name=name, location=location, picture=picture,
                               lab_validation=lab_validation, videoconference=videoconference,
                               television_screen=television_screen, projector=projector,
                               paperboard=paperboard, whiteboard=whiteboard,
                               wall_whiteboard=wall_whiteboard, computer=computer)


def create_user(name, status):
    """
    @param name: str
    @param status: str
    @return: User
    """
    return User.objects.create(name=name, status=status)


def create_meeting(room, user, start_timestamps, duration, title):
    """
    @param room: Room
    @param user: User
    @param start_timestamps: datetime.datetime
    @param duration: int
    @param title: str
    @return: Meeting
    """
    return func.create_a_new_meeting(room=room, user=user, start_timestamps=start_timestamps,
                                     duration=duration, title=title)


class FunctionsFileTests(TestCase):
    @staticmethod
    def test_days_in_a_months():
        thirty = func.days_in_a_months(2022, 4)
        thirty_one = func.days_in_a_months(2023, 12)
        twenty_eight = func.days_in_a_months(2022, 2)
        twenty_nine = func.days_in_a_months(2024, 2)
        assert thirty == 30
        assert thirty_one == 31
        assert twenty_eight == 28
        assert twenty_nine == 29
        twenty_eight = func.days_in_a_months(2100, 2)
        twenty_nine = func.days_in_a_months(2000, 2)
        assert twenty_eight == 28
        assert twenty_nine == 29

    @staticmethod
    def test_shift_date():
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

    @staticmethod
    def test_create_a_new_meeting_default():
        meet = func.create_a_new_meeting(create_room(1, "name", "location", "picture",
                                                     videoconference=False, television_screen=False,
                                                     projector=False, paperboard=False,
                                                     whiteboard=False, wall_whiteboard=False,
                                                     computer=False, lab_validation=False),
                                         create_user("a user", "staff"),
                                         make_aware(datetime.datetime(2022, 3, 5)), "title")
        assert meet is not None
        assert meet in Meeting.objects.all()
        assert meet.duration == 1
        assert meet.other_persons is meet.physically_present_person is None

    @staticmethod
    def test_create_a_new_meeting_all_parameter():
        meet = func.create_a_new_meeting(create_room(1, "name", "location", "picture",
                                                     videoconference=False, television_screen=False,
                                                     projector=False, paperboard=False,
                                                     whiteboard=False, wall_whiteboard=False,
                                                     computer=False, lab_validation=False),
                                         create_user("a user", "staff"),
                                         make_aware(datetime.datetime(2022, 3, 5)), "title",
                                         duration=2, other_persons="other",
                                         physically_present_person=4)
        assert meet is not None
        assert meet in Meeting.objects.all()
        assert meet.duration == 2
        assert meet.other_persons == "other"
        assert meet.physically_present_person == 4

    @staticmethod
    def test_modify_a_meeting_modifying():
        meet = func.create_a_new_meeting(create_room(1, "name", "location", "picture",
                                                     videoconference=False, television_screen=False,
                                                     projector=False, paperboard=False,
                                                     whiteboard=False, wall_whiteboard=False,
                                                     computer=False, lab_validation=False),
                                         create_user("a user", "staff"),
                                         make_aware(datetime.datetime(2022, 3, 5)), "title")
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
        meet = func.create_a_new_meeting(create_room(1, "name", "location", "picture",
                                                     videoconference=False, television_screen=False,
                                                     projector=False, paperboard=False,
                                                     whiteboard=False, wall_whiteboard=False,
                                                     computer=False, lab_validation=False),
                                         create_user("a user", "staff"),
                                         make_aware(datetime.datetime(2022, 3, 5)), "title", duration=2,
                                         other_persons="other", physically_present_person=4)
        func.modify_a_meeting(meet, remove_other_persons=True, remove_physically_present_person=True)
        modified_meeting = Meeting.objects.get(id=meet.id)
        assert modified_meeting.other_persons is None
        assert modified_meeting.physically_present_person is None
        assert modified_meeting.duration == 2
        assert modified_meeting.title == "title"

    @staticmethod
    def test_modify_a_meeting_delete_and_modify():
        meet = func.create_a_new_meeting(create_room(1, "name", "location", "picture",
                                                        videoconference=False, television_screen=False,
                                                        projector=False, paperboard=False,
                                                        whiteboard=False, wall_whiteboard=False,
                                                        computer=False, lab_validation=False),
                                         create_user("a user", "staff"),
                                         make_aware(datetime.datetime(2022, 3, 5)), "title",
                                         duration=2, other_persons="other", physically_present_person=4)
        func.modify_a_meeting(meet, start_timestamps=make_aware(datetime.datetime(2022, 4, 6, 18, 45)),
                              title="another title", remove_other_persons=True,
                              physically_present_person=3)
        modified_meeting = Meeting.objects.get(id=meet.id)
        assert modified_meeting.other_persons is None
        assert modified_meeting.physically_present_person == 3
        assert modified_meeting.duration == 2
        assert modified_meeting.title == "another title"

    @staticmethod
    def test_delete_meeting():
        meeting = create_meeting(create_room(1, "name", "location", "picture",
                                             videoconference=False, television_screen=False,
                                             projector=False, paperboard=False, whiteboard=False,
                                             wall_whiteboard=False, computer=False,
                                             lab_validation=False), create_user("a user", "staff"),
                                 make_aware(datetime.datetime(2022, 3, 5)), title="title", duration=2)
        func.delete_meeting(meeting)
        assert meeting not in Meeting.objects.all()


class RoomModelTests(TestCase):

    @staticmethod
    def test_str():
        room = create_room(capacity=2, name="a room", location="9ème étage", picture="an image",
                           lab_validation=False, videoconference=False, television_screen=False,
                           projector=False, paperboard=False, whiteboard=False, wall_whiteboard=False,
                           computer=True)
        assert str(room) == "a room"

    @staticmethod
    def test_assets():
        room = create_room(capacity=2, name="a room", location="9ème étage", picture="an image",
                           lab_validation=True, videoconference=True, television_screen=False,
                           projector=False, paperboard=False, whiteboard=False, wall_whiteboard=False,
                           computer=True)
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
        user = create_user("a user", "staff")
        assert str(user) == "a user"


class MeetingModelTests(TestCase):

    @staticmethod
    def test_str():
        room = create_room(2, "a room", "9ème étage", "an image", False, False, False, False, False,
                           False, True, False)
        user = create_user("a user", "staff")
        meeting = create_meeting(room, user, make_aware(datetime.datetime(2022, 3, 10, 10, 30)), 2,
                                 "a meeting")
        assert str(meeting) == "a meeting in a room, by a user"

    @staticmethod
    def test_modify_one_thing():
        room = create_room(2, "a room", "9ème étage", "an image", False, False, False, False, False,
                           False, True, False)
        user = create_user("a user", "staff")
        meeting = create_meeting(room, user, make_aware(datetime.datetime(2022, 3, 10, 10, 30)), 2,
                                 "a meeting")
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
        room = create_room(2, "a room", "9ème étage", "an image", False, False, False, False, False,
                           False, True, False)
        user = create_user("a user", "staff")
        meeting = create_meeting(room, user, make_aware(datetime.datetime(2022, 3, 10, 10, 30)), 2,
                                 "a meeting")
        meeting.modify(room=create_room(4, "another room", "9ème étage", "another image", True, False,
                                        True, False, False, False, True, False),
                       user=create_user("other person", "not staff"), title="new name",
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
        room = create_room(2, "a room", "9ème étage", "an image", False, False, False, False, False,
                           False, True, False)
        user = create_user("a user", "staff")
        meeting = create_meeting(room, user, make_aware(datetime.datetime(2022, 3, 10, 10, 30)), 2,
                                 "a meeting")
        meeting.delete_meeting()
        assert meeting not in Meeting.objects.all()

    @staticmethod
    def test_remove_attribute():
        room = create_room(2, "a room", "9ème étage", "an image", False, False, False, False, False,
                           False, True, False)
        user = create_user("a user", "staff")
        meeting = create_meeting(room, user, make_aware(datetime.datetime(2022, 3, 10, 10, 30)), 2,
                                 "a meeting")
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


class IndexViewTests(TestCase):
    pass


class RoomViewTests(TestCase):
    def test_nonexistent_room_id(self):
        response = self.client.get(reverse("booking_meeting_room:room_view", args=(1, )))
        self.assertEqual(response.status_code, 404)
        # en cas de 'post' au lieu de 'get', on a l'erreur suivante :
        # AssertionError: 405 != 404

    def test_existent_room_id(self):
        room = create_room(3, "a room", "8eme etage", "a picture", True, False, False, False, True,
                           False, True)
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


class UserViewTests(TestCase):
    def test_nonexistent_user_id(self):
        response = self.client.get(reverse("booking_meeting_room:user_view", args=(1, )))
        self.assertEqual(response.status_code, 404)

    def test_existent_user_id(self):
        user = create_user("a user", "staff")
        response = self.client.get(reverse(f"booking_meeting_room:user_view", args=(user.id,)))
        self.assertEqual(response.status_code, 200)
        assert f'"name": "{user.name}"' in response.data["user"]
        assert f'"status": "{user.status}"' in response.data["user"]


class MeetingViewTests(TestCase):
    def test_nonexistent_meeting_id(self):
        response = self.client.get(reverse("booking_meeting_room:meeting_view", args=(1,)))
        self.assertEqual(response.status_code, 404)

    def test_existent_meeting_id(self):
        room = create_room(2, "a room", "9ème étage", "an image", False, False, False, False, False,
                           False, True, False)
        user = create_user("a user", "staff")
        meeting = create_meeting(room, user, make_aware(datetime.datetime(2022, 9, 23, 2, 45)), 2,
                                 "a meeting")
        response = self.client.get(reverse(f"booking_meeting_room:meeting_view", args=(meeting.id,)))
        self.assertEqual(response.status_code, 200)
        assert f'"title": "{meeting.title}"' in response.data["meeting"]
        assert f'"room_id": {room.id}' in response.data["meeting"]
        assert f'"user_id": {user.id}' in response.data["meeting"]
        assert f'"duration": {meeting.duration}' in response.data["meeting"]
        assert '"year": 2022' in response.data["meeting"]
        assert '"day": 23' in response.data["meeting"]
        assert '"month": 9' in response.data["meeting"]
        assert '"hour": 2' in response.data["meeting"]
        assert '"minute": 45' in response.data["meeting"]

'''
class IsFreeRoomViewTests(TestCase):
    def test_no_meeting(self):
        room = create_room(3, "a room", "8ème étage", "a picture", True, False, False, False, True,
                           False, True)
        response = self.client.get(
            reverse("booking_meeting_room:is_free_room_view", args=(room.id, 2022, 12, 29, 23, 56)))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["meeting"], "No meeting scheduled")
        self.assertEqual(response.data["free"], True)
        assert '"name": "a room"' in response.data["room"]

    def test_occupied_room(self):
        room = create_room(3, "a room", "8ème étage", "a picture", True, False, False, False, True,
                           False, True)
        create_meeting(room, create_user("user", "staff"),
                       make_aware(datetime.datetime(2022, 9, 12, 15, 10)), 2, "a meeting")
        response = self.client.get(
            reverse("booking_meeting_room:is_free_room_view", args=(room.id, 2022, 9, 12, 15, 56)))
        self.assertEqual(response.status_code, 200)
        assert '"title": "a meeting"' in response.data["meeting"]
        self.assertEqual(response.data["free"], False)
        assert '"name": "a room"' in response.data["room"]

    def test_free_room(self):
        room = create_room(3, "a room", "8ème étage", "a picture", True, False, False, False, True,
                           False, True)
        create_meeting(room, create_user("user", "staff"),
                       make_aware(datetime.datetime(2022, 9, 10, 15, 10)), 2, "a meeting")
        create_meeting(room, create_user("user", "staff"),
                       make_aware(datetime.datetime(2022, 9, 12, 16, 0)), 2, "a meeting")
        response = self.client.get(
            reverse("booking_meeting_room:is_free_room_view", args=(room.id, 2022, 9, 12, 15, 59)))
        self.assertEqual(response.status_code, 200)
        assert '"title": "a meeting"' in response.data["meeting"]
        self.assertEqual(response.data["free"], True)
        assert '"name": "a room"' in response.data["room"]
'''


class MeetingListViewTests(TestCase):
    def test_no_meeting_existent(self):
        response = self.client.get(reverse("booking_meeting_room:meeting_list_view"))
        self.assertEqual(response.status_code, 200)
        assert len(response.data) == 0

    def test_with_meeting(self):
        room = create_room(2, "a room", "9eme etage", "an image", False, False, False, False, False,
                           False, True, False)
        user = create_user("a user", "staff")
        meeting1 = create_meeting(room, user, make_aware(datetime.datetime(2022, 9, 23, 2, 45)), 2,
                                  "first meeting")
        meeting2 = create_meeting(room, user, make_aware(datetime.datetime(2022, 9, 23, 5, 45)), 1,
                                  "second meeting")
        meeting3 = create_meeting(room, user, make_aware(datetime.datetime(2022, 9, 23, 6, 45)), 2,
                                  "third meeting")
        meeting4 = create_meeting(room, user, make_aware(datetime.datetime(2022, 9, 14, 10, 45)), 3,
                                  "fourth meeting")
        response = self.client.get(reverse("booking_meeting_room:meeting_list_view"))
        self.assertEqual(response.status_code, 200)
        assert f'"title": "{meeting4.title}"' in response.data["meeting 0"]
        assert '"title": "first meeting"' in response.data["meeting 1"]
        assert '"title": "second meeting"' in response.data["meeting 2"]
        assert f'"title": "{meeting3.title}"' in response.data["meeting 3"]
        assert '"start_timestamps": {\n        "day": 14,\n        "hour": 10,\n' \
               '        "minute": 45,\n        "month": 9,\n' \
               '        "year": 2022\n    }' in response.data["meeting 0"]
        assert f'"user_id": {meeting1.user.id}' in response.data["meeting 1"]
        assert f'"room_id": {meeting2.room.id}' in response.data["meeting 2"]


class RoomListViewTests(TestCase):
    def test_no_room_existent(self):
        response = self.client.get(reverse("booking_meeting_room:room_list_view"))
        self.assertEqual(response.status_code, 200)
        assert len(response.data) == 0

    def test_with_room(self):
        room1 = create_room(2, "a room", "9eme etage", "an image 1", False, False, False, False, False,
                            False, True, False)
        room2 = create_room(2, "another room", "9eme etage", "an image 2", False, False, True, False, False,
                            False, True, False)
        room3 = create_room(6, "a third room", "8eme etage", "an image 3", False, True, False, True, False,
                            True, False, False)
        room4 = create_room(8, "huge room", "9eme etage", "an image 4", True, True, False, False, False,
                            False, False, True)
        response = self.client.get(reverse("booking_meeting_room:room_list_view"))
        self.assertEqual(response.status_code, 200)
        assert f'"name": "{room4.name}"' in response.data["room 0"]
        assert '"name": "another room"' in response.data["room 1"]
        assert '"name": "a third room"' in response.data["room 2"]
        assert f'"name": "{room1.name}"' in response.data["room 3"]
        assert '"location": "9eme etage"' in response.data["room 0"]
        assert f'"computer": {str(room2.computer).lower()}' in response.data["room 1"]
        assert f'"paperboard": {str(room3.paperboard).lower()}' in response.data["room 2"]
