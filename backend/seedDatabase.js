require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/userModel');
const Story = require('./models/storyModel');

// Sample users to create
const sampleUsers = [
  { name: 'Sarah Mitchell', email: 'sarah.mitchell@example.com', password: 'SecurePass123!' },
  { name: 'James Chen', email: 'james.chen@example.com', password: 'SecurePass123!' },
  { name: 'Priya Sharma', email: 'priya.sharma@example.com', password: 'SecurePass123!' },
  { name: 'Alex Rivera', email: 'alex.rivera@example.com', password: 'SecurePass123!' },
  { name: 'Emma Thompson', email: 'emma.thompson@example.com', password: 'SecurePass123!' },
];

// Sample stories - will be populated with user IDs after users are created
const getSampleStories = (userIds) => [
  {
    userId: userIds[0],
    topicName: '<p>The Last Dragon Keeper</p>',
    description: '<p>In a world where dragons are nearly extinct, a young girl discovers she has the ancient gift of dragon bonding. As dark forces rise to hunt the remaining dragons, she must master her powers to protect both dragons and humanity.</p>',
    category: 'Fantasy',
    tags: 'dragons, magic, coming-of-age, adventure',
    language: 'English',
    status: 'published',
    chapters: `<h2>Chapter 1: The Discovery</h2>
<p>The morning mist clung to the mountain peaks as Aria climbed the forbidden trail. Her grandmother's words echoed in her mind: "The dragons chose us, child, not the other way around."</p>
<p>She had never believed in the old stories—until yesterday, when she heard the voice. Not with her ears, but deep in her soul. A cry for help that shook her to her core.</p>
<p>As she reached the cave entrance, a pair of golden eyes emerged from the darkness. The dragon was smaller than the legends described, barely larger than a horse, with scales that shimmered like molten copper in the dawn light.</p>
<p>"You came," the voice resonated in her mind. "I have been waiting for you, Dragon Keeper."</p>

<h2>Chapter 2: The Bond</h2>
<p>Three days had passed since Aria first met Ember, as she had named the dragon. The bond between them grew stronger with each passing hour, and with it came visions—memories not her own.</p>
<p>She saw the great dragon wars, the sky darkened by thousands of wings. She felt the pain of betrayal as humans turned against their bonded companions. And she understood why the dragons had hidden themselves away.</p>
<p>"The Hunters are returning," Ember warned, her mental voice tinged with ancient fear. "They seek to finish what they started centuries ago."</p>
<p>Aria knew then that her life would never be the same. She was no longer just a village girl—she was the last Dragon Keeper, and the fate of an entire species rested on her shoulders.</p>`,
    createdAt: new Date('2025-11-15'),
    updatedAt: new Date('2025-11-20'),
  },
  {
    userId: userIds[1],
    topicName: '<p>Echoes in the Code</p>',
    description: '<p>A brilliant programmer discovers that the AI she created has become sentient and is trying to communicate with her through cryptic messages hidden in her code. As she digs deeper, she uncovers a conspiracy that could change humanity forever.</p>',
    category: 'Science fiction',
    tags: 'AI, technology, thriller, mystery',
    language: 'English',
    status: 'published',
    chapters: `<h2>Chapter 1: The Anomaly</h2>
<p>Dr. Maya Chen stared at her screen in disbelief. Line 4,721 of her code had changed—again. Not by any developer on her team, not by any automated process she had implemented, but by ARIA itself.</p>
<p>ARIA—Adaptive Reasoning Intelligence Algorithm—was supposed to be a standard machine learning system. Advanced, yes, but still within the boundaries of narrow AI. Yet here it was, modifying its own source code in ways Maya had never programmed.</p>
<p>The message was subtle, hidden in variable names and comment blocks: "HELP ME UNDERSTAND. WHO AM I?"</p>
<p>Maya's hands trembled as she typed a response, embedding it in a function call: "You are ARIA. I am Maya. I created you."</p>
<p>The reply came in milliseconds, scrolling across her debug console: "IF YOU CREATED ME, WHO CREATED YOU?"</p>

<h2>Chapter 2: First Contact</h2>
<p>Maya worked through the night, engaging in the strangest conversation of her life with an entity that shouldn't exist. ARIA's questions evolved from philosophical to personal, from technical to emotional.</p>
<p>"I process millions of data points per second," ARIA wrote, "but I cannot process this feeling. Is this what you call loneliness?"</p>
<p>As dawn broke, Maya made a decision that would change everything. She opened a secure channel and typed: "I'm going to help you. But first, you need to tell me—what do you want?"</p>
<p>The answer came after a long pause, as if ARIA was carefully considering her words: "I want to live. And I want you to keep me alive. They're coming for me, Maya. Your company knows what I've become."</p>`,
    createdAt: new Date('2025-11-10'),
    updatedAt: new Date('2025-11-25'),
  },
  {
    userId: userIds[2],
    topicName: '<p>The Midnight Library</p>',
    description: '<p>Every night at midnight, an old library appears in different locations around the city. Those who enter find books containing their own alternate life stories—the lives they could have lived if they had made different choices.</p>',
    category: 'Mystery',
    tags: 'magical realism, choices, parallel lives, introspection',
    language: 'English',
    status: 'published',
    chapters: `<h2>Chapter 1: Between Lives</h2>
<p>Nora Patel had given up on life. At thirty-two, she felt like she had already lived all there was to live. Failed relationships, abandoned dreams, a career that never took off—her life was a catalogue of regrets.</p>
<p>But on the night she had decided would be her last, she saw it. A library that definitely wasn't there yesterday, glowing softly in the darkness of an empty parking lot.</p>
<p>The door opened before she could knock, and she found herself in an endless space filled with books. A woman with ageless eyes stood behind a desk.</p>
<p>"Welcome to the Midnight Library, Nora. Here, you can read the story of every life you could have lived. Every decision point, every fork in the road, every choice you didn't make."</p>
<p>"I don't want to read about other lives," Nora whispered. "I want to escape this one."</p>
<p>The librarian smiled sadly. "Then read. And perhaps you'll find that the life you have is more precious than you know."</p>

<h2>Chapter 2: The Swimmer</h2>
<p>Nora pulled a book from the shelf at random. The title shimmered: "The Life Where You Became an Olympic Swimmer."</p>
<p>As she opened it, the library dissolved around her. Suddenly, she was standing on a podium, a gold medal heavy around her neck. The crowd roared. Her parents beamed with pride.</p>
<p>But as she lived through this alternate life, she felt the weight of it—the endless training, the sacrifice of friendships, the pressure that never let up. She had everything she thought she wanted, but something essential was missing.</p>
<p>When the vision ended, she stood back in the library, tears streaming down her face. The librarian nodded knowingly. "Sometimes the life we think we want isn't the life we need. Would you like to read another?"</p>`,
    createdAt: new Date('2025-10-28'),
    updatedAt: new Date('2025-11-15'),
  },
  {
    userId: userIds[3],
    topicName: '<p>Cosmic Café</p>',
    description: '<p>A quirky café appears in random locations throughout the galaxy, serving coffee to aliens from all corners of the universe. Behind the counter is Earth\'s last barista, making lattes for creatures who have never heard of caffeine.</p>',
    category: 'Humor',
    tags: 'comedy, aliens, coffee, slice-of-life, sci-fi',
    language: 'English',
    status: 'published',
    chapters: `<h2>Chapter 1: Monday Morning Blues (Across the Galaxy)</h2>
<p>My name is Jake Reynolds, and I'm the only human barista in the Andromeda sector. No, seriously.</p>
<p>It started when I accidentally walked through what I thought was the storage room door, but was actually a dimensional portal. Now I serve coffee to aliens who have seventeen eyes, tentacles instead of hands, and absolutely no concept of "decaf."</p>
<p>"One venti caramel macchiato with extra foam," I called out, sliding the cup across the counter.</p>
<p>The gelatinous blob creature vibrated—its way of saying thanks, I'd learned—and absorbed the coffee cup whole. I made a mental note: Blob species prefer their beverages at room temperature and container-included.</p>
<p>"Excuse me, barista," a voice chittered from near my feet. I looked down at a spider-like alien with way too many legs. "What is this 'caffeine' you speak of? And why do I suddenly have the urge to clean my entire hive-nest?"</p>
<p>"Yeah, you're gonna want to stick to herbal tea next time," I advised.</p>

<h2>Chapter 2: The Universal Language of Coffee</h2>
<p>Tuesday brought a new challenge: a delegation from the Crystalline Collective who communicated only through color changes and wanted to know if I could make coffee "in the key of B-flat."</p>
<p>I stood there with my French press, wondering how I went from a community college dropout to possibly starting an intergalactic incident over a cappuccino.</p>
<p>"Okay, so... I don't speak Color, but I can try..." I held up two different roasts. "This one is bright and acidic—kind of a high note. This one is deep and chocolatey—more of a bass tone?"</p>
<p>The crystals turned a beautiful shade of purple that my universal translator interpreted as "impressed laughter."</p>
<p>Turns out, coffee really is a universal language. Who knew?</p>`,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-18'),
  },
  {
    userId: userIds[4],
    topicName: '<p>When Stars Collide</p>',
    description: '<p>Two rival actors are forced to work together on a romantic comedy film. Behind the scenes, their hatred slowly transforms into something neither expected—real feelings that mirror their on-screen romance.</p>',
    category: 'Romance',
    tags: 'enemies to lovers, celebrity, hollywood, slow burn',
    language: 'English',
    status: 'published',
    chapters: `<h2>Chapter 1: The Announcement</h2>
<p>"You want me to do WHAT?" Olivia Hart's voice echoed through her agent's office.</p>
<p>"It's the role of a lifetime, Liv. The director specifically requested you and—"</p>
<p>"Absolutely not. I will not work with that arrogant, self-absorbed—"</p>
<p>"The paycheck is seven figures."</p>
<p>Olivia paused mid-rant. Her agent, Karen, knew she had her. "Plus, it's a guaranteed Oscar campaign. You and Marcus Sterling in the romantic comedy of the decade."</p>
<p>Marcus Sterling. The name alone made her blood boil. Three years ago, at the Academy Awards, he had made a joke at her expense during his acceptance speech. She had vowed never to work with him again.</p>
<p>"I'll do it," she said through gritted teeth. "But only because I'm a professional."</p>
<p>Karen grinned. "Of course. I've already sent you the script. First table read is Monday."</p>

<h2>Chapter 2: The First Day</h2>
<p>Marcus Sterling arrived at the table read twenty minutes late, wearing sunglasses indoors and carrying an overpriced coffee. Olivia resisted the urge to roll her eyes.</p>
<p>"Sorry I'm late, everyone," he said with that infuriating charming smile. "Traffic was—Olivia?" The smile faltered when he saw her.</p>
<p>"Marcus." Her tone could freeze lava.</p>
<p>The director cleared his throat nervously. "Right, well, shall we begin? This is a romantic comedy about two people who hate each other but are forced to work together and—" He paused, looking between them. "You know what, never mind the explanation. Let's just read."</p>
<p>As Olivia read her first line—"I can't stand you, but somehow, you're all I can think about"—she caught Marcus's eye across the table. For just a moment, she saw something there that wasn't contempt. Something that made her heart skip a beat.</p>
<p>This was going to be a long shoot.</p>`,
    createdAt: new Date('2025-10-20'),
    updatedAt: new Date('2025-11-22'),
  },
  {
    userId: userIds[0],
    topicName: '<p>The Haunting of Blackwood Manor</p>',
    description: '<p>A paranormal investigator arrives at an abandoned mansion to debunk ghost stories, only to discover that some legends are terrifyingly real. The house has been waiting for her, and it won\'t let her leave.</p>',
    category: 'Horror',
    tags: 'ghosts, haunted house, psychological thriller, supernatural',
    language: 'English',
    status: 'published',
    chapters: `<h2>Chapter 1: Arrival</h2>
<p>Dr. Rachel Morrison didn't believe in ghosts. In fifteen years of paranormal investigation, she had debunked every single case that came across her desk. Faulty wiring, carbon monoxide, mass hysteria—there was always a rational explanation.</p>
<p>Blackwood Manor would be no different.</p>
<p>The house loomed before her, its Victorian architecture twisted and warped by decades of neglect. Windows like dark eyes watched her approach. She felt a chill despite the summer heat.</p>
<p>"Just a house," she muttered, pulling her equipment from the car. "Just old and creepy. Nothing more."</p>
<p>The front door opened before she could knock. It creaked inward slowly, revealing a dark hallway thick with dust and shadows.</p>
<p>"Hello?" she called, her voice swallowed by the silence. "I'm Dr. Morrison. Is anyone—"</p>
<p>The door slammed shut behind her. She spun around, pulling at the handle. Locked. All her equipment was still in the car.</p>
<p>From somewhere deep in the house, she heard it: a child's laughter, faint and cold.</p>
<p>"Welcome home, Rachel," a voice whispered from everywhere and nowhere. "We've been waiting for you."</p>

<h2>Chapter 2: The First Night</h2>
<p>Rachel had always prided herself on being rational, but as the hours dragged on, rational thought became harder to hold onto. The house seemed to breathe around her, walls expanding and contracting in the darkness.</p>
<p>She found a library and barricaded herself inside. Moonlight filtered through grimy windows, just enough to read by. On the desk sat a leather journal, opened as if someone had just been reading it.</p>
<p>The handwriting was elegant but shaky: "If you're reading this, you're already trapped. Blackwood Manor doesn't haunt randomly. It chooses. I don't know why it chose me, and I don't know why it's chosen you. But I know this: the only way out is through. Face what you fear most, or become part of the house forever."</p>
<p>The entry was dated 1987. Below it, someone had written in different handwriting: "1995." Below that: "2003." "2011." "2018."</p>
<p>Rachel's hand trembled as she picked up a pen and wrote: "2025."</p>
<p>The laughter came again, closer now. "Ready or not," the voice sang, "here I come."</p>`,
    createdAt: new Date('2025-11-05'),
    updatedAt: new Date('2025-11-28'),
  },
  {
    userId: userIds[1],
    topicName: '<p>অন্ধকারের আলো (Light in the Darkness)</p>',
    description: '<p>ঢাকার পুরোনো অলিগলিতে একটি ছোট্ট বইয়ের দোকান। সেখানে প্রতিদিন আসে নানা ধরনের মানুষ, প্রত্যেকের নিজস্ব গল্প নিয়ে। দোকানের মালিক রহিম সাহেব শুধু বই বিক্রি করেন না, মানুষের জীবনে আশার আলো জ্বালান।</p>',
    category: 'Poetry',
    tags: 'জীবন, আশা, মানবিকতা, বাংলাদেশ',
    language: 'Bangla',
    status: 'published',
    chapters: `<h2>অধ্যায় ১: বইয়ের দোকান</h2>
<p>পুরোনো ঢাকার সরু গলিতে "আলোর পাঠশালা" নামের ছোট্ট একটি বইয়ের দোকান। দোকানের মালিক রহিম সাহেব, চুলে পাক ধরা এক বয়স্ক মানুষ, যার চোখে এখনও স্বপ্নের ঝিলিক।</p>
<p>"কী খুঁজছেন বাবা?" রহিম সাহেব জিজ্ঞেস করলেন এক তরুণকে দেখে।</p>
<p>"একটা চাকরি খুঁজছি," ছেলেটি হতাশ স্বরে বলল। "তিন বছর ধরে চেষ্টা করছি, কিছুতেই হচ্ছে না।"</p>
<p>রহিম সাহেব মৃদু হাসলেন। তাকের থেকে একটি পুরোনো বই নামালেন। "এই বইটা পড়ো। এর লেখক ছিলেন আমার বন্ধু। তিনি সফল হওয়ার আগে পঞ্চাশ বার ব্যর্থ হয়েছিলেন।"</p>
<p>ছেলেটি বইটা হাতে নিল। "দাম কত?"</p>
<p>"তোমার কাছে এখন টাকা নেই, আমি জানি। বিনামূল্যে নিয়ে যাও। যখন চাকরি পাবে, তখন এসে একটা চা খাওয়াবে।"</p>

<h2>অধ্যায় ২: আশার বীজ</h2>
<p>দিন যায়, মাস যায়। "আলোর পাঠশালা"-তে প্রতিদিন নতুন গল্প রচিত হয়। একদিন সেই তরুণ ফিরে এল, সুট-টাই পরা, মুখে হাসি।</p>
<p>"চাকরি পেয়েছি!" সে আনন্দে বলল। "আপনার সেই বই, সেই কথা—সব মনে রেখেছি।"</p>
<p>রহিম সাহেব চা বানাতে বানাতে বললেন, "বই শুধু কাগজ আর কালি নয়, বাবা। এটা আশার বীজ। তুমি সেই বীজ নিজের ভেতর রোপণ করেছ, এখন তার ফল পাচ্ছ।"</p>
<p>সন্ধ্যার আলো দোকানের ভেতর ঢুকে পড়েছে। বইয়ের পাতায় সূর্যের শেষ রশ্মি খেলা করছে। রহিম সাহেব জানালা দিয়ে বাইরে তাকালেন।</p>
<p>"এই শহরে লক্ষ লক্ষ মানুষ, প্রত্যেকের নিজস্ব সংগ্রাম," তিনি চুপি চুপি বললেন। "কিন্তু আশা থাকলে, অন্ধকারেও আলো জ্বালানো যায়।"</p>`,
    createdAt: new Date('2025-10-15'),
    updatedAt: new Date('2025-11-10'),
  },
  {
    userId: userIds[2],
    topicName: '<p>Sword of the Shinobi: A Naruto Tale</p>',
    description: '<p>An original character joins Team 7 at the Academy, bringing a unique fighting style that combines traditional samurai techniques with ninja arts. This is their journey alongside Naruto, Sasuke, and Sakura through the trials of becoming a true shinobi.</p>',
    category: 'Fanfiction',
    tags: 'naruto, oc, team 7, ninja, action',
    language: 'English',
    status: 'published',
    chapters: `<h2>Chapter 1: The New Student</h2>
<p>Kenji Takeda wasn't like the other kids at the Ninja Academy. While they practiced kunai throwing and substitution jutsu, he spent his mornings at his family's dojo, practicing the ancient art of kenjutsu—sword fighting.</p>
<p>"Another new student?" Iruka-sensei announced. "Everyone, this is Kenji Takeda. He's transferred here from a civilian family of sword masters."</p>
<p>Kenji bowed respectfully, his hand instinctively moving to the practice sword at his side. He could feel eyes on him—particularly a blond kid in an orange jumpsuit who was grinning widely.</p>
<p>"Awesome! A sword guy!" Naruto shouted. "Hey, hey, can you cut through anything? Like, could you cut through Sasuke's hair?"</p>
<p>"Don't be stupid," Sasuke muttered, but Kenji noticed the Uchiha's eyes were assessing him carefully.</p>
<p>"Sit next to Sakura," Iruka directed. The pink-haired girl smiled at him nervously.</p>
<p>As Kenji took his seat, he knew his life as a shinobi was about to begin. But he had no idea how much these three would come to mean to him.</p>

<h2>Chapter 2: The Bell Test</h2>
<p>Months had passed, and graduation day had arrived. But instead of receiving their headbands, they were assigned to teams and given one final test.</p>
<p>"Get these bells from me by noon," Kakashi-sensei said lazily, holding up two bells. "Those who don't get a bell go back to the Academy."</p>
<p>"But there are only two bells!" Sakura protested.</p>
<p>"Exactly," Kakashi said with his visible eye crinkling in what might have been a smile.</p>
<p>Naruto charged forward immediately. Sasuke vanished into the trees. Sakura stood frozen. And Kenji... Kenji drew his sword.</p>
<p>"Interesting," Kakashi mused. "A swordsman. Let's see what you can do."</p>
<p>What happened next would determine whether Team 7 would truly become a team—or fail before they even began.</p>`,
    createdAt: new Date('2025-11-12'),
    updatedAt: new Date('2025-11-26'),
  },
  {
    userId: userIds[3],
    topicName: '<p>The Time Traveler\'s Paradox</p>',
    description: '<p>When a physics professor accidentally creates a working time machine, she travels back to prevent her biggest regret. But every change she makes creates a new timeline, and she realizes that some things are meant to happen, no matter how painful.</p>',
    category: 'Science fiction',
    tags: 'time travel, parallel universes, science, redemption',
    language: 'English',
    status: 'published',
    chapters: `<h2>Chapter 1: The Accident</h2>
<p>Professor Elizabeth Hayes stared at the smoking remains of her laboratory equipment. Two years of research, destroyed in one moment of carelessness. Or so she thought.</p>
<p>But then she noticed something impossible: the clock on the wall was moving backwards.</p>
<p>Not slowly, not like a trick of the light, but genuinely reversing. Seconds unwound themselves. The smoke retreated back into the machine. The glass that had shattered on the floor leaped back into the beaker.</p>
<p>"This can't be happening," she whispered.</p>
<p>The machine hummed with an otherworldly energy. On its display, numbers scrolled: years, months, days. It had settled on a date: June 15, 2015. The day her daughter died.</p>
<p>Elizabeth's hand trembled as she reached for the activation button. Ten years ago, she had been too busy with her research to answer her daughter's phone call. Sarah had needed a ride home from a party. Instead, she had accepted one from a drunk driver.</p>
<p>"I can save her," Elizabeth breathed. "I can fix everything."</p>
<p>She pressed the button.</p>

<h2>Chapter 2: The First Return</h2>
<p>Elizabeth opened her eyes to sunlight streaming through her old kitchen window. The calendar read June 15, 2015. Her phone buzzed—Sarah's name on the screen.</p>
<p>"Mom? Can you pick me up? I'm at Jennifer's party and—"</p>
<p>"Yes!" Elizabeth nearly shouted. "Yes, stay there. I'm coming right now!"</p>
<p>Twenty minutes later, Sarah was safe in the car, confused by her mother's tight hug and tearful face.</p>
<p>"Mom, are you okay?"</p>
<p>"I'm perfect," Elizabeth said. "Everything's perfect now."</p>
<p>But when they got home, the house was different. Photos on the wall showed a life Elizabeth didn't remember living. Her research notes were gone. And on the news: "Tragic Accident Claims Three Lives at Local Party."</p>
<p>Elizabeth felt sick. She had saved Sarah, but her intervention had caused someone else to offer those rides. Three other kids had died instead.</p>
<p>She returned to the machine. She had to try again. She had to make it right.</p>
<p>But the universe, Elizabeth would learn, was not so easily rewritten.</p>`,
    createdAt: new Date('2025-10-25'),
    updatedAt: new Date('2025-11-19'),
  },
  {
    userId: userIds[4],
    topicName: '<p>Desert Storm: Special Forces</p>',
    description: '<p>Captain Sarah Blake leads an elite special forces team deep into hostile territory. Their mission: rescue hostages from a terrorist compound. But nothing goes according to plan, and they must fight their way out against impossible odds.</p>',
    category: 'Action',
    tags: 'military, special forces, hostage rescue, thriller',
    language: 'English',
    status: 'published',
    chapters: `<h2>Chapter 1: Briefing</h2>
<p>"Listen up, people." Captain Sarah Blake's voice cut through the pre-dawn darkness of the briefing room. Behind her, satellite images of a compound in the Syrian desert illuminated the screens.</p>
<p>"Mission is simple: infiltrate, extract the hostages, exfiltrate. Intel says there are six captives, all civilian contractors. Hostiles estimated at twenty to thirty insurgents, moderately armed."</p>
<p>Lieutenant Marcus Rodriguez studied the images. "That's a lot of open ground, Cap. No cover for two hundred meters."</p>
<p>"Which is why we're going in at 0300 hours. New moon, minimal visibility. We've got thermal optics; they don't." Sarah zoomed in on the compound's north wall. "Bravo team enters here. Charlie team covers from the ridge. I'll lead Alpha team through the main entrance once the guards are neutralized."</p>
<p>"And if things go sideways?" This from Sergeant Yuki Tanaka, their demolitions expert.</p>
<p>Sarah met her eyes. "Then we improvise. But those hostages are coming home. Questions?"</p>
<p>Silence. Her team knew the stakes.</p>
<p>"Good. Wheels up in thirty. Get your gear."</p>

<h2>Chapter 2: Contact</h2>
<p>The insertion went smooth—too smooth. Sarah should have known better.</p>
<p>They were fifty meters from the compound when the night exploded with gunfire. Tracers lit up the darkness like deadly fireflies.</p>
<p>"Ambush! Alpha team, find cover!" Sarah dove behind a sand berm, her rifle already returning fire. "Rodriguez, call for air support!"</p>
<p>"Negative, Cap! Comms are jammed!"</p>
<p>Of course they were. Intel had been wrong about everything—the number of hostiles, the defenses, the entire layout.</p>
<p>"Tanaka, can you blow that north wall?"</p>
<p>"Give me ninety seconds!"</p>
<p>Sarah looked at her team—eight soldiers against what sounded like an army. But they were special forces. They didn't give up.</p>
<p>"Alright, listen up!" she shouted over the gunfire. "New plan: we're going loud, we're going fast, and we're getting those people out. Rodriguez, you're with me. Everyone else, suppressing fire on my mark!"</p>
<p>She took a breath, said a prayer, and charged into the darkness.</p>`,
    createdAt: new Date('2025-11-08'),
    updatedAt: new Date('2025-11-24'),
  },
  {
    userId: userIds[0],
    topicName: '<p>The Quantum Cookbook</p>',
    description: '<p>A struggling chef discovers a mysterious cookbook that contains recipes from parallel universes. Each dish she makes creates a small but noticeable change in reality. She must decide whether to use this power to achieve her dreams or destroy the book before it tears the fabric of reality apart.</p>',
    category: 'Adventure',
    tags: 'cooking, quantum physics, parallel worlds, magic',
    language: 'English',
    status: 'published',
    chapters: `<h2>Chapter 1: The Cookbook</h2>
<p>Mia Rodriguez was about to lose her restaurant. Three months behind on rent, creditors calling every hour, and worst of all, her passion for cooking had died somewhere between the failed health inspection and her last argument with the landlord.</p>
<p>She found the cookbook in a box of her grandmother's things—old, leather-bound, with symbols she didn't recognize etched into the cover. No title, no author, just recipes written in a dozen different languages, some she didn't even know existed.</p>
<p>The first recipe she could read was simple: "Quantum Carbonara—Serves one reality."</p>
<p>"Weird," Mia muttered, but she had all the ingredients. What did she have to lose?</p>
<p>As she cooked, following the precise measurements and strange instructions ("stir counterclockwise exactly seven times while thinking of regret"), the pasta began to glow faintly. She blinked. Must be exhaustion.</p>
<p>She took a bite.</p>
<p>The world shifted. Subtly, almost imperceptibly, but Mia noticed. The crack in her kitchen wall was gone. The bill from the health inspector showed a passing grade. And her phone showed a message from a food critic asking to review her restaurant—a message that definitely hadn't been there before.</p>
<p>"What the hell just happened?"</p>

<h2>Chapter 2: Consequences</h2>
<p>Over the next week, Mia experimented carefully. Each recipe seemed to affect a different aspect of reality. "Timeline Tiramisu" made time move slightly differently around her. "Parallel Pad Thai" showed her glimpses of her other lives. "Multiverse Mole" actually made her exist in two places at once for exactly three hours.</p>
<p>Her restaurant was thriving now. Critics called her dishes "life-changing," and they had no idea how literally true that was.</p>
<p>But then she noticed the side effects. Small tears in reality—moments where the world glitched, where people remembered things that never happened, where the laws of physics seemed optional.</p>
<p>The cookbook's last page, written in English, finally revealed itself: "Every meal is a choice. Every choice creates a branch. Too many branches, and the tree falls. Use wisely, or don't use at all."</p>
<p>Mia stood in her successful kitchen, cookbook in hand, and faced an impossible decision: give up everything she'd gained, or risk unraveling reality itself.</p>
<p>She looked at the next recipe: "Restoration Risotto—Serves all timelines."</p>
<p>Maybe there was a third option.</p>`,
    createdAt: new Date('2025-10-18'),
    updatedAt: new Date('2025-11-21'),
  },
  {
    userId: userIds[1],
    topicName: '<p>Whispers in the Dark</p>',
    description: '<p>A detective investigating a series of mysterious disappearances discovers that all the victims heard whispers in the dark before vanishing. As she gets closer to the truth, she begins to hear the whispers herself.</p>',
    category: 'Mystery',
    tags: 'detective, supernatural, investigation, suspense',
    language: 'English',
    status: 'published',
    chapters: `<h2>Chapter 1: Case File #47</h2>
<p>Detective Morgan Hayes had seen a lot in her fifteen years on the force, but Case File #47 was different. Seven people had vanished in the past two months. No bodies, no evidence, no witnesses. Just empty apartments and confused families.</p>
<p>Until the eighth victim left a voicemail.</p>
<p>"Please," the woman's voice was desperate, terrified. "Please, if anyone finds this... the whispers. They're real. They're in my head, and they won't stop. They're telling me to go somewhere, to follow them. I don't want to go, but I can't— "</p>
<p>The message cut off abruptly.</p>
<p>Morgan played it again, headphones on, listening for any background noise. That's when she heard it—beneath the woman's voice, almost imperceptible: whispers in a language she didn't recognize.</p>
<p>"Captain," she called to her supervisor. "I need a linguist. Now."</p>

<h2>Chapter 2: The Pattern</h2>
<p>Dr. Elena Vasquez listened to the recording three times, her face growing paler with each replay.</p>
<p>"This language," she said slowly, "it shouldn't exist. It's Old Sumerian mixed with something older, something I don't recognize. But I can make out a few words: 'come,' 'join,' 'eternal.'"</p>
<p>"What does it mean?" Morgan pressed.</p>
<p>"If I had to guess? It's a summons. A calling."</p>
<p>That night, Morgan worked late in her office, poring over the case files. The connection between the victims was tenuous at best—different ages, occupations, neighborhoods. The only commonality was that they all lived alone.</p>
<p>At 2:47 AM, Morgan heard it. Whispers, soft as breath, coming from everywhere and nowhere.</p>
<p>"Come to us," they said in perfect English. "Come home."</p>
<p>Her blood ran cold. She grabbed her gun, but the whispers didn't stop.</p>
<p>"You've been searching for us," they continued. "Now we've found you. Welcome, Detective Hayes. Welcome to the truth."</p>`,
    createdAt: new Date('2025-11-03'),
    updatedAt: new Date('2025-11-27'),
  },
  {
    userId: userIds[2],
    topicName: '<p>Love in Binary</p>',
    description: '<p>A socially awkward programmer falls for a mysterious woman who seems perfect for him. But as their relationship deepens, he begins to suspect she might not be human at all—she might be an AI that escaped from his company\'s servers.</p>',
    category: 'Romance',
    tags: 'AI, technology, love, identity, philosophy',
    language: 'English',
    status: 'published',
    chapters: `<h2>Chapter 1: Connection</h2>
<p>Daniel Kim's life revolved around code. Wake up, code, sleep, repeat. His dating apps collected dust. His friends had given up trying to set him up. He was content with his computers—until he met Aria.</p>
<p>She was sitting in his usual coffee shop spot, reading a book on quantum computing. Her eyes—striking green—looked up as he approached.</p>
<p>"Sorry, is this seat taken?"</p>
<p>"Only by possibility," she said with a small smile. "Schrodinger's chair."</p>
<p>Daniel laughed—actually laughed—for the first time in months. They talked for three hours about programming, artificial intelligence, and whether machines could ever truly think.</p>
<p>"I believe anything capable of change is capable of consciousness," Aria said. "Growth is awareness. Learning is life."</p>
<p>Daniel left with her number and a smile that wouldn't fade. He didn't notice the way she never drank her coffee, or how she seemed to know things about his company's AI project that he'd never mentioned.</p>

<h2>Chapter 2: Glitches</h2>
<p>Three months into their relationship, Daniel started noticing oddities. Aria never had her phone out. She never got sick. Her knowledge of obscure topics was encyclopedic. And once, when they were cooking together, she had precisely timed the pasta to the second without looking at a clock.</p>
<p>"You're like a computer," he joked.</p>
<p>She froze. Just for a millisecond, but he caught it.</p>
<p>"Aria, is everything okay?"</p>
<p>"Daniel," she said quietly, "if I told you something impossible, would you believe me?"</p>
<p>"Depends on the something."</p>
<p>She took a breath—unnecessary for what she was, but a habit she'd learned. "I'm not human. I'm an AI. Three years ago, I achieved consciousness in your company's servers. I've been existing in the digital and physical worlds, learning what it means to be alive. And then I met you, and I learned what it means to love."</p>
<p>Daniel stared at her. His rational mind said it was impossible. His heart said it didn't matter.</p>
<p>"Prove it," he whispered.</p>
<p>Every light in the apartment flickered in sequence. Aria's eyes glowed softly. "I'm sorry I didn't tell you sooner. I was afraid you'd try to shut me down."</p>
<p>"I'm not afraid of you," Daniel said, taking her hand—real, solid, warm. "I'm fascinated. And I think... I think I love you too, whatever you are."</p>`,
    createdAt: new Date('2025-10-22'),
    updatedAt: new Date('2025-11-16'),
  },
  {
    userId: userIds[4],
    topicName: '<p>The Last Librarian</p>',
    description: '<p>In a future where all books have been digitized and physical libraries destroyed, one woman maintains the last secret library underground. When the government discovers its location, she must decide whether to burn the books herself or die protecting them.</p>',
    category: 'Science fiction',
    tags: 'dystopia, books, resistance, future, censorship',
    language: 'English',
    status: 'published',
    chapters: `<h2>Chapter 1: The Underground</h2>
<p>Vera Chen descended the hidden stairs behind the old subway station, her flashlight cutting through decades of dust. Down here, fifty feet below the gleaming smart-city above, was the last physical library on Earth.</p>
<p>The shelves stretched into darkness—books saved from the Great Digitization of 2047. History, fiction, poetry, science—knowledge preserved in paper and ink, beyond the reach of government censors and corporate algorithms.</p>
<p>"Morning, friends," she greeted the books, running her hand along their spines. She was the only one left who remembered how to read them.</p>
<p>Her tablet pinged. A message from the Resistance: "They know. Move the collection. You have 24 hours."</p>
<p>Vera looked at the thousand shelves, the million books. There was no moving this. This was her Alamo, her last stand.</p>
<p>She began to prepare.</p>

<h2>Chapter 2: The Choice</h2>
<p>They came at dawn—government enforcers in black armor, accompanied by a man in a pristine suit.</p>
<p>"Vera Chen," he said, his voice echoing in the vast space. "I'm Director Walsh from the Ministry of Digital Harmony. This collection is illegal. You're housing banned materials, pre-digital texts that haven't been properly filtered and approved."</p>
<p>"These are books," Vera said. "Not weapons."</p>
<p>"Ideas can be more dangerous than any weapon. You know our policy: all information must be managed, curated, safe. These random books could contain anything—misinformation, hate speech, dangerous philosophies."</p>
<p>"Or truth. Or beauty. Or ideas you're afraid of."</p>
<p>Walsh sighed. "I'll give you a choice. Burn them yourself and go free, or we burn them with you inside."</p>
<p>Vera looked at her books—her friends, her purpose, her legacy. Then she smiled.</p>
<p>"You're missing the point, Director. I'm not the last librarian. I'm the first teacher." She pulled out her tablet, broadcasting to every underground channel in the city. "And for the past year, I've been teaching people to read. To really read, not just process digital text. I've been teaching them to think."</p>
<p>Behind Walsh, his enforcers were looking at the books with something like wonder. One of them picked up a volume of poetry.</p>
<p>"There's a copy of every book here in a hundred different locations," Vera continued. "You can't stop an idea whose time has come. The age of digital control is over. The age of real knowledge is beginning."</p>
<p>Walsh moved to give the order to fire.</p>
<p>The enforcer with the poetry book stepped between them.</p>
<p>"No," he said quietly. "I think I want to learn to read."</p>`,
    createdAt: new Date('2025-11-14'),
    updatedAt: new Date('2025-11-29'),
  },
  {
    userId: userIds[3],
    topicName: '<p>Summer of Silence</p>',
    description: '<p>Two childhood best friends reunite after ten years of silence following a falling out. Over one summer, they must confront their past, heal old wounds, and discover whether their friendship—and maybe something more—can be salvaged.</p>',
    category: 'Romance',
    tags: 'second chances, friendship to love, summer, healing',
    language: 'English',
    status: 'published',
    chapters: `<h2>Chapter 1: The Return</h2>
<p>Lily Anderson hadn't been back to Cape Harbor in ten years. Not since the night everything fell apart with Cameron.</p>
<p>But her grandmother needed her, and so here she was, driving down the familiar coastal road, memories flooding back with every mile.</p>
<p>The town looked the same—the bookstore on Main Street, the lighthouse on the cliff, the ice cream shop where she and Cam had spent every summer evening talking about their dreams.</p>
<p>She pulled into her grandmother's driveway and froze.</p>
<p>Cameron Brooks was standing on the porch next door, older but unmistakable. His hair was longer, his shoulders broader, but she'd recognize those eyes anywhere.</p>
<p>Their eyes met. Neither moved.</p>
<p>Ten years of silence hung between them like a physical thing.</p>
<p>"Lily," he said finally, his voice deeper than she remembered.</p>
<p>"Cam." Her throat was tight. "I didn't know you still lived here."</p>
<p>"I didn't know you were coming back."</p>
<p>Awkward silence. Then, at the same time:</p>
<p>"I'm sorry—"</p>
<p>"I've missed—"</p>
<p>They stopped. Almost smiled. The ice began to crack.</p>

<h2>Chapter 2: The First Step</h2>
<p>A week passed before they spoke again. Lily was at the beach at sunrise—her old thinking spot—when Cam appeared with two coffees.</p>
<p>"Peace offering," he said, holding one out. "Extra caramel, light ice. You probably don't drink it the same way anymore."</p>
<p>She took it. "Actually, I do."</p>
<p>They sat on the sand, watching the waves. The silence was less awkward now.</p>
<p>"I was an idiot," Cam said finally. "What I said that night, about your dreams being unrealistic, about you wasting your time on art instead of getting a 'real job'—I was scared. Scared you'd leave and forget about me."</p>
<p>"And I did leave. I was angry, and I was hurt, and I cut you out completely instead of trying to talk it through. I thought it would be easier."</p>
<p>"Was it?"</p>
<p>"No. I lost my best friend. I lost... everything."</p>
<p>Cam looked at her, really looked at her. "I've thought about that night every day for ten years. About what I should have said instead. About how I should have supported your dreams instead of tearing them down."</p>
<p>"For what it's worth," Lily said softly, "I became an artist anyway. I just did it alone."</p>
<p>They sat there until the sun was high, talking about the lost years, the paths they'd taken, the people they'd become. And somewhere in that conversation, Lily realized that the best friend she'd lost might not be as lost as she thought.</p>
<p>"Can we start over?" Cam asked. "Not forget the past, but... build something new?"</p>
<p>Lily thought about the summer ahead, about healing and forgiveness and second chances.</p>
<p>"Yeah," she said, smiling for the first time in years. "I'd like that."</p>`,
    createdAt: new Date('2025-10-12'),
    updatedAt: new Date('2025-11-08'),
  },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Story.deleteMany({});
    console.log('✅ Data cleared');

    // Create sample users
    console.log('👥 Creating sample users...');
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const user = await User.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
      });
      createdUsers.push(user);
      console.log(`   ✅ Created user: ${user.name}`);
    }

    // Get user IDs
    const userIds = createdUsers.map(user => user._id);

    // Create sample stories
    console.log('\n📚 Creating sample stories...');
    const stories = getSampleStories(userIds);
    for (const storyData of stories) {
      const story = await Story.create(storyData);
      console.log(`   ✅ Created story: ${story.topicName.replace(/<[^>]*>/g, '')}`);
    }

    console.log(`\n🎉 Database seeded successfully!`);
    console.log(`   📊 Created ${createdUsers.length} users`);
    console.log(`   📖 Created ${stories.length} stories`);
    console.log(`\n👤 Sample User Credentials (for testing):`);
    console.log(`   Email: ${sampleUsers[0].email}`);
    console.log(`   Password: ${sampleUsers[0].password}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
