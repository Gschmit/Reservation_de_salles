""" Models """

from django.db import models
from django.utils.timezone import make_aware
from json import dumps
import datetime


def json_default(value):
    """
    To serialize datetime.datetime objects et all objects define here
    """
    if isinstance(value, datetime.datetime):
        return value.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
    # elif isinstance(value, Room or User or Meeting):
    #     return value.toJSON()
    else:
        return value.__dict__


class Room(models.Model):
    """
    Rooms available in Ikos
    """
    capacity = models.IntegerField(default=1)
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    picture = models.ImageField()
    lab_validation = models.BooleanField(default=False)
    videoconference = models.BooleanField("is possible videoconference")
    television_screen = models.BooleanField()
    projector = models.BooleanField()
    paperboard = models.BooleanField()
    whiteboard = models.BooleanField()
    wall_whiteboard = models.BooleanField()
    computer = models.BooleanField()

    def __str__(self):
        return self.name

    def assets(self):
        """
        Return a dictionary with the assets as key and their boolean value in value
        """

        return {"lab_validation": self.lab_validation,
                "videoconference": self.videoconference,
                "television_screen": self.television_screen,
                "projector": self.projector,
                "paperboard": self.paperboard,
                "whiteboard": self.whiteboard,
                "wall_whiteboard": self.wall_whiteboard,
                "computer": self.computer}

    def toJSON(self):
        """
        To serialize the class
        """
        return dumps(self, default=lambda o: json_default(o), sort_keys=True, indent=4)


class User(models.Model):
    """
    Ikos employees
    """
    name = models.CharField(max_length=100)
    status = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    def toJSON(self):
        """
        To serialize the class
        """
        return dumps(self, default=lambda o: json_default(o), sort_keys=True, indent=4)


class Meeting(models.Model):
    """
    Meetings programmed
    """
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    start_timestamps = models.DateTimeField()
    duration = models.IntegerField(default=1)
    title = models.CharField(max_length=200)
    physically_present_person = models.IntegerField(blank=True, null=True)             # optional
    other_persons = models.CharField(max_length=300, blank=True, null=True)            # optional
    finished = False        # in order to set free a room without deleting the meeting

    def __str__(self):
        return f"{self.title} in {self.room}, by {self.user}"

    def modify(self, room=None, user=None, start_timestamps=None, title=None, duration=None,
               physically_present_person=None, other_persons=None, finished=None):
        """
        Allow to change easily as many attributes as needed
        """
        if len(list({room, user, start_timestamps, title, duration, physically_present_person,
                     other_persons})) == 1:
            return "You asked to modify nothing"
        else:
            if room is not None:
                self.__setattr__("room", room)
            if user is not None:
                self.__setattr__("user", user)
            if start_timestamps is not None:
                self.__setattr__("start_timestamps", start_timestamps)
            if title is not None:
                self.__setattr__("title", title)
            if duration is not None:
                self.__setattr__("duration", duration)
            if physically_present_person is not None:
                self.__setattr__("physically_present_person", physically_present_person)
            if other_persons is not None:
                self.__setattr__("other_persons", other_persons)
            if finished is not None:
                self.__setattr__("finished", finished)
            self.save()

    def delete_meeting(self):
        """
        Delete the instance of Meeting
        """
        self.delete()

    def remove_attribute(self, physically_present_person=False, other_persons=False):
        """
        Change to None the specified item
        """
        if physically_present_person:
            self.__setattr__("physically_present_person", None)
        if other_persons:
            self.__setattr__("other_persons", None)
        self.save()

    def slot(self):         # Uses : for check_overlapping and for the put method of HandleMeetingView
        """
        To know from when to when is the meeting
        """
        if isinstance(self.start_timestamps, str):
            start = make_aware(datetime.datetime.strptime(str(self.start_timestamps),
                                                          '%Y-%m-%dT%H:%M:%S.%fZ'))
        else:
            start = self.start_timestamps
        duration = datetime.timedelta(minutes=int(str(self.duration)) * 30)
        end = start + duration
        return start, end

    def check_overlapping(self, other):
        """
        Check if the two meetings are compatible
        Return False if the two meetings are in the same room, at the same moment
        """
        if self.room != other.room:
            return False
        else:
            self_start, self_end = self.slot()
            other_start, other_end = other.slot()
            if self_end <= other_start:
                return False
            elif self_start >= other_end:
                return False
            else:
                return True

    def toJSON(self):
        """
        To serialize the class
        """
        return dumps(self, default=lambda o: json_default(o), sort_keys=True, indent=4)
