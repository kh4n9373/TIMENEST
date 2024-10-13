import pymongo
import json
from bson import ObjectId
from config.config_env import MONGODB_URL

class MongoJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)
    
class MongoManager:
    __instances = {}

    def __new__(cls, db):
        if db not in cls.__instances:
            cls.__instances[db] = super().__new__(cls)
            cls.__instances[db].__initialized = False
        return cls.__instances[db]

    def __init__(self, db):
        if self.__initialized:
            return
        self.__initialized = True

        self.db = db
        self.connection_str = MONGODB_URL
        self.__client = pymongo.MongoClient(self.connection_str)
        self.__database = self.__client[self.db]

    # Inserts a single document into the specified collection
    def insert_one(self, collection_name, data):
        collection = self.__database[collection_name]
        collection.insert_one(data)

    # Inserts multiple documents into the specified collection
    def insert_many(self, collection_name, data, options={}):
        collection = self.__database[collection_name]
        collection.insert_many(data, **options)

    # Performs a bulk upsert (update or insert) operation on the specified collection
    def upsert_many(self, collection_name, data):
        collection = self.__database[collection_name]
        collection.bulk_write(data)

    # Updates a single document in the specified collection based on a filter
    def update_one(self, collection_name, filter, data):
        collection = self.__database[collection_name]
        collection.update_one(filter, data)

    # Updates multiple documents in the specified collection based on a filter
    def update_many(self, collection_name, filter, data):
        collection = self.__database[collection_name]
        collection.update_many(filter, data)

    # Deletes multiple documents in the specified collection based on a filter
    def delete_many(self, collection_name, filter={}):
        collection = self.__database[collection_name]
        collection.delete_many(filter)

    # Finds a single document in the specified collection based on a filter
    def find_one(self, collection_name, filter={}):
        collection = self.__database[collection_name]
        return collection.find_one(filter)

    # Finds multiple documents in the specified collection based on a filter, with optional projection, sorting, offset, and limit
    def find(
        self,
        collection_name,
        filter={},
        projection=None,
        sort=None,
        offset=0,
        limit=None,
    ):
        collection = self.__database[collection_name]
        result = collection.find(filter, projection)
        if sort:
            result = result.sort(*sort)
        if offset:
            result = result.skip(offset)
        if limit:
            result = result.limit(limit)
        return list(result)

    # Performs an aggregation operation on the specified collection
    def aggregate(self, collection_name, filter={}):
        collection = self.__database[collection_name]
        return collection.aggregate(filter)

    # Finds the distinct values for a specified field across a single collection and returns the list of distinct values
    def distinct(self, collection_name, field, filter={}):
        collection = self.__database[collection_name]
        return collection.distinct(field, filter)

    # New Methods for Querying

    # Finds a user by username
    def find_user_by_username(self, username):
        return self.find_one("user", {"UserName": username})

    # Finds a group by group name
    def find_group_by_groupname(self, groupname):
        return self.find_one("group", {"GroupName": groupname})

    # Finds the schedule of an admin by user ID
    def find_admin_schedule_by_user_id(self, user_id):
        return self.find_one("admin", {"UserID": user_id}, {"Schedule": 1})

    # Finds a calendar by calendar ID
    def find_calendar_by_calendar_id(self, calendar_id):
        return self.find_one("calendar", {"CalendarID": calendar_id})

    # Finds tasks by their status
    def find_tasks_by_status(self, status):
        return self.find("task", {"Status": status})

    # Finds tasks that start and end within a specified time range
    def find_tasks_by_time_range(self, start_time, end_time):
        return self.find("task", {"StartTime": {"$gte": start_time}, "EndTime": {"$lte": end_time}})

    # Finds subtasks by the parent task ID
    def find_subtasks_by_parent_task_id(self, parent_task_id):
        return self.find("subtask", {"ParentTaskID": parent_task_id})

    # Finds notes that involve a specified participant
    def find_notes_by_participant(self, participant_id):
        return self.find("note", {"Participants": participant_id})
    
    def find_info(self, userid):
        record = self.find_one(collection_name = "users", filter = {"userID": userid})
        list_of_information = {
            "username": record["UserName"],
            "tasks": self.find(collection_name = "tasks", filter = {"userID": userid},projection={"_id": 0}),
            "group": self.find(collection_name = "group", filter = {"userID": userid},projection={"_id": 0}),
            "project": self.find(collection_name = "projects", filter = {"userID": userid},projection={"_id": 0})
        }
        return list_of_information