enum Accountstatus {
  Unverified,
  Verified,
  Locked
}

enum Gender {
  Male,
  Female,
  Unknown
}

enum FileType {
  Image,
  Video,
  Audio,
  All
}

enum Audience {
  Public,
  Followers,
  Private
}

enum ConversationType {
  Personal,
  Friend,
  Group
}

export { Accountstatus, Gender, FileType, Audience, ConversationType }
