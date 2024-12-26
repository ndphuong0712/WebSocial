import { Accountstatus, Audience } from '@constants/enum'
import { faker } from '@faker-js/faker'
import Post from '@models/collections/post.models'
import User from '@models/collections/user.models'
import hashPassword from '@utils/hashPassword'
import conversationService from 'src/services/conversation.services'
import database from 'src/services/database.services'

const createRandomUser = () => ({
  username: faker.internet.username(),
  email: faker.internet.email(),
  password: hashPassword('12345Aa!'),
  fullname: 'ABC'
})

const createRandomPost = () => ({
  audience: Audience.Public,
  content: faker.lorem.paragraph(),
  media: []
})

const seedData = async () => {
  const users = faker.helpers.multiple(createRandomUser, { count: 20 })
  const userFakeObjs = users.map((user, i) => {
    const date = new Date(2022, 0, i + 1)
    const userObj = new User(user as any)
    userObj.accountStatus = Accountstatus.Verified
    userObj.createdAt = date
    delete userObj.timeVerifyEmail
    return userObj
  })
  const user1 = new User({
    username: 'phuong',
    email: 'phuong@gmail.com',
    password: hashPassword('12345Aa!'),
    fullname: 'Nguyễn Đông Phương',
    avartar:
      'https://vcdn1-vnexpress.vnecdn.net/2016/05/24/chuP-1464063049_1464063089_1464064527.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=5jzpHWXF01SE2uijxLbT1Q'
  })

  const user2 = new User({
    username: 'duc',
    email: 'duc@gmail.com',
    password: hashPassword('12345Aa!'),
    fullname: 'Lê Duy Đức',
    avartar: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTS1FWdzkrD4emMUoUm_c1nBo5zA-bvGyuSkAPGk4ikTVzAFrUg'
  })

  const user3 = new User({
    username: 'xyz',
    email: 'xyz@gmail.com',
    password: hashPassword('12345Aa!'),
    fullname: 'X Y Z',
    avartar:
      'https://png.pngtree.com/png-vector/20231016/ourmid/pngtree-kawaii-cute-star-yellow-color-with-smile-faces-cartoon-for-kids-png-image_10198393.png'
  })

  const userRealObjs = [user1, user2, user3].map((user, i) => {
    const date = new Date(2022, 1, i + 1)
    user.accountStatus = Accountstatus.Verified
    user.createdAt = date
    delete user.timeVerifyEmail
    return user
  })

  const userObjs = [...userFakeObjs, ...userRealObjs]

  const posts = faker.helpers.multiple(createRandomPost, { count: 23 })
  const postFakeObjs = posts.map((post, i) => {
    const date = new Date(2022, 7, i + 1)
    const userId = i < 11 ? user2._id.toString() : i < 22 ? user3._id.toString() : user1._id.toString()
    const postObj = new Post({ userId, ...post })
    postObj.createdAt = date
    return postObj
  })

  await Promise.all([
    database.users.insertMany(userObjs),
    ...userObjs.map(userObj => conversationService.createPersonalConversation(userObj._id.toString())),
    database.posts.insertMany(postFakeObjs)
  ])

  console.log('Seed data successfully')
  database.closeConnect()
}

seedData()
