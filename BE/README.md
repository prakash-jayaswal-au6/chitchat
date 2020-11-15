# chitchat-social-media app (**_ chitchat2.herokuapp.com_**)

Project done by _Prakash Jayaswal_

Deployed URL: https://chitchat2.herokuapp.com/


# About Our Project:

In this digitally evolved era, almost everyone, from celebrities to the common man, is using different social media channels, such as Facebook, Twitter, LinkedIn, Google+, to stay connected with their friends, relatives, and followers. In fact, most of the people are now addicted and are literally living in the world of social media.
Our aim is to make a social media app ChitChat .We refer Instagram for its features. 
Like most social media apps, ChitChat allows you to follow users that you’re interested in. This creates a feed on the homepage showing recent posts from everyone you follow. You can Like posts and comment on them.
In addition to posting normal photos and videos, which stay on your page permanently, ChitChat also supports Stories.  Stories allow you to post one or more photos and video clips in a series. Anyone can view these for 24 hours, after which they expire.
Aside from this, ChitChat also supports direct messaging so you can chat with friends in private. You can also explore profiles to see what else you might have interest in.


## Users of Application

| Role              | Rights                                                                                                                                             |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| API Generator     | Maintenance of API                                                                                                                                 |
| App Administrator | Monitor user and other user activities, techinal assistance regarding database CURD operations                                                                                             |
| User           |  Create post  details, Photo Upload, change password, Forgot Password, View all post,like and dislike post |
| Other User            | Reset Password, Forgot Password, View all available post, Follow and Unfollow, Search user             |

### End Points of APIs

1.  USER ROUTES

    - Registering User Account

      > POST https://chitchat2.herokuapp.com//register

    - Confirm  Register Token Message

      > GET https://chitchat2.herokuapp.com//confirmation/:token


    - Loging into Farmer Account

      > POST https://chitchat2.herokuapp.com//login


    - Porfile Details 
      > GET https://chitchat2.herokuapp.com/profile/{using Authorization token}

    - Update Profile Images

      > PUT https://chitchat2.herokuapp.com/updatepic/{using Authorization token}

    - View Other User Profile Details

      > GET https://chitchat2.herokuapp.com/user/:id/{using Authorization token}


    - Change Account Password

      > PUT https://chitchat2.herokuapp.com/changepassword/{using Authorization token}


    - Reset Password

      > POST https://chitchat2.herokuapp.com/reset-password

    - New Password Token Message

      > POST https://chitchat2.herokuapp.com/new-password

    - Follow User

      > PUT https://chitchat2.herokuapp.com/follow/{using Authorization token}

    - Unfallow User

      > PUT https://chitchat2.herokuapp.com/unfollow/{using Authorization token}

    
    - Search-Other User

      > POST https://chitchat2.herokuapp.com/search-users/{using Authorization token}

    
    -  Chatting With Other User

      > GET https://chitchat2.herokuapp.com/getChat/:id/{using Authorization token}



2.  POST ROUTES

    - View All post

      > GET https://chitchat2.herokuapp.com/allpost/{using Authorization token}
     
    - Create New Post

      > POST https://chitchat2.herokuapp.com/createpost/{using Authorization token}

    - View User Own Post
      > GET https://chitchat2.herokuapp.com/mypost/{using Authorization token}

    - Like The Post 
       > PUT https://chitchat2.herokuapp.com/like/{using Authorization token}


    - Unlike The Post 
       > PUT https://chitchat2.herokuapp.com/unlike/{using Authorization token}


    - Comment On Post 
       > PUT  https://chitchat2.herokuapp.com/comment/{using Authorization token}


    - Delete Post 
       > DELETE https://chitchat2.herokuapp.com/deletepost/:postId/{using Authorization token}
       

     - Post Expoler

       > GET https://chitchat2.herokuapp.com/subscriptionpost/{using Authorization token}

    
    
# Features :

### \* REGISTRAION & LOGIN Related (For both user and other user's)

---

1.  Email Verification for Registration.
2.  Only Unique Account Creation allowed (Email based Uniqueness).
3.  Multiple device Login facility.
4.  Editing Password (After login).
5.  Resetting Passwords (System Generated Password via mail).

### \*USER Related

---

1.  User uploads images.
2.  User can comment his/her post.
3.  User can delete his/her post.
4.  User can view other  user's post.
5.  User can comment,like or dislike other user's post.
6.  User can search other user's
7.  User can chat with other user's


### \*OTHER USER'S Related

---

1.  Other user's can view user posted images.
2.  Other user's can comment,like,dislike user post.
3.  Other user's can follow or unfollow user
4.  Other user's can search.
5.  Other user's can uplaod post,update profile. etc
6.  Other user's can chat with user


# Technologies used:

---

- Nodemailer (_To send system generated emails_)
- Cloudinary (_Upload Images_)
- Express Js (_Framework for node Js_)
- Json Web token (_For Authentication_)
- Bcrypt Js (_For Hashing_)
- Helmet (_To Secure all Headings and Status_)
- Compressor (_To compress the size of the data_)
- Mongodb (_To Connect to Mongoose Database_)
- Socket-io (_For chating_)

# Future Goals :

      1. Pagination.
      2. Notifaction.
      3. Video Chat box.
      4. Profile updation
      5. Mobile Application Implementation
      6. Mobile OTP for login
      7. Audio Music
      
      

# Image Upload 


https://res.cloudinary.com/dnjqxnccx/image/upload/v1596723259/jndzifxg18wlxqww6dhu.jpg

# ER Diagram(pdf)

https://app.lucidchart.com/documents/edit/397c3f83-4465-4662-9ed6-0498a9d720b7/0_0?shared=true