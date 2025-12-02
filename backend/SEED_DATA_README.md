# 🌱 Database Seed Data Guide

## 📊 Schema Compliance

This seed script generates data that **exactly matches** your database schema:

### Story Schema Fields:
```javascript
{
  userId: ObjectId (ref: User) ✅
  topicName: String (HTML formatted) ✅
  description: String (HTML formatted) ✅
  category: String (valid categories) ✅
  tags: String (comma-separated) ✅
  language: String (English/Bangla) ✅
  status: 'draft' | 'published' ✅
  chapters: String (story content) ✅
  createdAt: Date ✅
  updatedAt: Date ✅
}
```

## 📚 Generated Data

### 5 Sample Users:
1. **Sarah Mitchell** - `sarah.mitchell@example.com`
2. **James Chen** - `james.chen@example.com`
3. **Priya Sharma** - `priya.sharma@example.com`
4. **Alex Rivera** - `alex.rivera@example.com`
5. **Emma Thompson** - `emma.thompson@example.com`

**Password for all users:** `SecurePass123!`

### 15 Sample Stories:

| Title | Category | Language | Author |
|-------|----------|----------|--------|
| The Last Dragon Keeper | Fantasy | English | Sarah Mitchell |
| Echoes in the Code | Science fiction | English | James Chen |
| The Midnight Library | Mystery | English | Priya Sharma |
| Cosmic Café | Humor | English | Alex Rivera |
| When Stars Collide | Romance | English | Emma Thompson |
| The Haunting of Blackwood Manor | Horror | English | Sarah Mitchell |
| অন্ধকারের আলো (Light in the Darkness) | Poetry | **Bangla** | James Chen |
| Sword of the Shinobi: A Naruto Tale | Fanfiction | English | Priya Sharma |
| The Time Traveler's Paradox | Science fiction | English | Alex Rivera |
| Desert Storm: Special Forces | Action | English | Emma Thompson |
| The Quantum Cookbook | Adventure | English | Sarah Mitchell |
| Whispers in the Dark | Mystery | English | James Chen |
| Love in Binary | Romance | English | Priya Sharma |
| The Last Librarian | Science fiction | English | Emma Thompson |
| Summer of Silence | Romance | English | Alex Rivera |

## 🎯 Story Features:

✅ **Realistic content** - No lorem ipsum, actual story narratives
✅ **Multiple chapters** - Each story has 2 complete chapters
✅ **HTML formatting** - Proper `<p>`, `<h2>` tags in topicName, description, and chapters
✅ **Diverse genres** - All 10 categories represented
✅ **Tags included** - Relevant, searchable tags
✅ **Published status** - All stories set to "published" for immediate visibility
✅ **Varied dates** - Realistic createdAt/updatedAt timestamps from Oct-Nov 2025
✅ **Bilingual** - Includes one Bangla story

## 🚀 How to Use

### Run the Seed Script:

```bash
cd backend
npm run seed
```

### Expected Output:
```
🌱 Starting database seed...
✅ Connected to MongoDB
🗑️  Clearing existing data...
✅ Data cleared
👥 Creating sample users...
   ✅ Created user: Sarah Mitchell
   ✅ Created user: James Chen
   ...
📚 Creating sample stories...
   ✅ Created story: The Last Dragon Keeper
   ✅ Created story: Echoes in the Code
   ...
🎉 Database seeded successfully!
   📊 Created 5 users
   📖 Created 15 stories

👤 Sample User Credentials (for testing):
   Email: sarah.mitchell@example.com
   Password: SecurePass123!
```

## ⚠️ Important Notes:

1. **Destructive Operation**: This script will **delete all existing users and stories** before seeding
2. **MongoDB Connection**: Requires valid `MONGO_URI` in `.env`
3. **Hashed Passwords**: All passwords are properly bcrypt-hashed
4. **Valid References**: All userId references are properly linked

## 🧪 Testing the Seeded Data:

### 1. Test Login:
```
Email: sarah.mitchell@example.com
Password: SecurePass123!
```

### 2. View Stories:
- Visit homepage - should show all 15 published stories
- Filter by category - test each genre
- Search functionality - try author names, tags, titles

### 3. Test Features:
- User can log in with any seeded account
- Stories display on homepage
- Category filters work
- Language filters work (English/Bangla)
- Search works for story titles, descriptions, authors, categories, tags

## 🎨 Story Categories Covered:

- ✅ Action (Desert Storm: Special Forces)
- ✅ Adventure (The Quantum Cookbook)
- ✅ Fanfiction (Sword of the Shinobi: A Naruto Tale)
- ✅ Fantasy (The Last Dragon Keeper)
- ✅ Horror (The Haunting of Blackwood Manor)
- ✅ Humor (Cosmic Café)
- ✅ Mystery (The Midnight Library, Whispers in the Dark)
- ✅ Poetry (অন্ধকারের আলো)
- ✅ Romance (When Stars Collide, Love in Binary, Summer of Silence)
- ✅ Science fiction (Echoes in the Code, The Time Traveler's Paradox, The Last Librarian)

## 🔧 Customization:

### Add More Stories:
Edit `seedDatabase.js` and add to the `getSampleStories()` array:

```javascript
{
  userId: userIds[0],
  topicName: '<p>Your Story Title</p>',
  description: '<p>Your description</p>',
  category: 'Fantasy', // Must be valid category
  tags: 'tag1, tag2, tag3',
  language: 'English', // or 'Bangla'
  status: 'published',
  chapters: '<h2>Chapter 1</h2><p>Content...</p>',
  createdAt: new Date('2025-11-01'),
  updatedAt: new Date('2025-11-15'),
}
```

### Add More Users:
Add to `sampleUsers` array:

```javascript
{
  name: 'Your Name',
  email: 'your.email@example.com',
  password: 'YourPassword123!'
}
```

## 📝 Notes on Data Quality:

- **No placeholders**: Every story has real, engaging content
- **Proper formatting**: HTML tags are correctly used
- **Realistic variety**: Different lengths, styles, and genres
- **Cultural diversity**: Includes Bangla language content
- **Fan content**: Includes Naruto fanfiction for fanfiction category testing
- **Multiple authors**: Stories distributed across all 5 sample users

## 🐛 Troubleshooting:

**"Error: MONGO_URI not defined"**
- Make sure `.env` file exists and contains valid `MONGO_URI`

**"Error: Cannot find module 'bcrypt'"**
- Run `npm install` to install dependencies

**"Duplicate key error"**
- The script clears data first, but if it fails partway, manually clear the database

**"Stories not appearing on homepage"**
- Check that stories have `status: 'published'` (they all do by default)
- Verify MongoDB connection is working
- Check browser console for frontend errors

## 💡 Pro Tips:

1. Run seed script whenever you need fresh test data
2. Use different user accounts to test multi-user features
3. Modify story dates to test sorting functionality
4. Add draft stories (change status to 'draft') to test profile page drafts
5. Test all category filters with the diverse story selection

---

**Happy Testing! 🚀**
