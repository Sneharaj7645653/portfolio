/* ============================================================
   Centralized content. Most entries are DUMMY placeholders —
   swap in real copy freely. Search "[PLACEHOLDER" for personal bits.
   ============================================================ */

export const CONTACT = {
  name: 'Sneha Raj',
  location: 'Bengaluru, India',
  phone: '+91-9334834461',
  email: 'sneha.24bcs10295@sst.scaler.com',
  linkedin: 'https://linkedin.com/in/sneharaj',
  leetcode: 'https://leetcode.com/sneharaj',
  github: 'https://github.com/sneharaj',
}

export const METRICS = [
  { value: '100+ DAU · 200+ Waitlist', label: 'Cysterhood MVP' },
  { value: '1,200+ Students / Event', label: 'Orators Platform' },
  { value: '3rd Place · ProdXPulse 2026', label: 'National AI Festival' },
]

/* -------------------- ABOUT -------------------- */

export const ABOUT = {
  paragraphs: [
    'I wear a lot of hats—software engineering, AI, product—currently pursuing dual B.Sc. CS degrees at Scaler School of Technology and BITS Pilani.',
    'At the core of everything I do is simple: understand the person on the other side, prioritize ruthlessly, and move fast. With AI tools today, shipping code isn\'t the hard part anymore. What actually matters is finding the right problem, building for the right people, and understanding the scale you\'re working at.',
    'I love defending my work and explaining the \'why\' behind what I build—and honestly, I apply that exact same logic to life outside of tech, too.',
  ],
  workPrinciples: [
    { emoji: '', title: 'No Ego, Just Questions', body: 'I’m quick to admit what I don’t know and even quicker to ask for help.' },
    { emoji: '', title: 'Feedback-Friendly', body: 'Tell me where it’s broken. Good feedback is the fastest shortcut to better work.' },
    { emoji: '', title: 'Respect the Clock', body: 'I value other people’s time—clear context, sharp priorities, zero fluff.' },
    { emoji: '', title: 'Honest & Direct', body: 'Say what needs to be said, kindly and clearly. No corporate riddles.' },
  ],
  facts: [
    { emoji: '🗣️', title: 'Professional Chit-Chatter', body: 'I love talking about anything and everything. It gives me a weird stash of random context that helps me connect dots in teams and easily translate across different domains.' },
    { emoji: '🏸', title: 'Colony Badminton Pro', body: 'The high-stakes kind where hitting the shuttle into a neighbor’s house is an automatic point lost.' },
  ],
}

/* -------------------- PROJECTS -------------------- */

export const PROJECTS = [
  {
    title: 'Cysterhood (0-to-1 MVP)',
    categories: ['Product'],
    year: '2026',
    summary: 'Conducted 20+ user interviews with working women managing PCOS to ship non-punitive streaks and anonymized Sisterhood Wins—scaling the web app from 0 to 100+ DAU, a 200+ waitlist, and a 700+ WhatsApp community.',
    skills: ['User Discovery', 'PRDs', 'Growth Loops'],
  },
  {
    title: 'SpeakCraft',
    categories: ['Product', 'Engineering', 'AI / ML'],
    year: '2026',
    summary: 'Asynchronous AI public-speaking practice platform adopted by 60–70 WAU (58% batch engagement). Boosted assignment completion from 35% to ~65% by replacing manual video forms with a 10-minute streak flow.',
    skills: ['Next.js', 'Supabase', 'Web Speech API', 'Gemini', 'Llama 3.3'],
  },
  {
    title: 'Student Alert Intake Analytics Pipeline',
    categories: ['Engineering', 'Product'],
    year: '2026',
    summary: 'Built an idempotent, audit-safe Python/SQLite ETL pipeline (6 pytest suites + quarantine layer) reconstructing 32,026 student requests—proving 83.95% were unresolved and making the data case against an AI chatbot.',
    skills: ['Python', 'SQLite', 'pytest', 'ETL', 'Data Modeling'],
  },
  {
    title: "Orators' Society Central Web Platform",
    categories: ['Product'],
    year: '2026',
    summary: 'Led product and analytics for a permanent campus club hub with instant sign-ups, archives, and RSVP tracking—growing club participation 4.5x (4% to 18%) and streamlining annual leadership handovers.',
    skills: ['Product Analytics', 'Roadmapping', 'Community', 'Web Hub'],
  },
  {
    title: 'AI Developer Documentation Engine',
    categories: ['Engineering', 'AI / ML'],
    year: '2026',
    summary: 'Automated markdown documentation generator and RAG-based codebase architecture query interface powered by Python and GitHub Webhooks.',
    skills: ['Python', 'RAG', 'GitHub Webhooks', 'LLMs'],
  },
  {
    title: 'Deep Learning Text Classification & Batch Optimization',
    categories: ['AI / ML'],
    year: '2026',
    summary: 'Benchmarked TF-IDF + MLP (91.57% test accuracy) against Embedding + LSTM (90.70%) on 120,000 AG News samples on an NVIDIA T4 GPU; achieved a 9.8x training speedup via mini-batch scaling.',
    skills: ['Python', 'TensorFlow/Keras', 'NLP', 'T4 GPU'],
  },
  {
    title: 'MiniCroppkins — Supervised ML',
    categories: ['AI / ML'],
    year: '2026',
    summary: 'End-to-end supervised machine learning pipeline covering data preprocessing, feature engineering, model training, and evaluation.',
    skills: ['Python', 'scikit-learn', 'Supervised ML'],
    links: [{ label: 'GitHub', href: 'https://github.com/Sneharaj7645653/minicroppkins_supervised_ml' }],
  },
  {
    title: 'MovieLens — Unsupervised ML',
    categories: ['AI / ML'],
    year: '2026',
    summary: 'Unsupervised learning and clustering analysis on the MovieLens dataset to uncover hidden viewing patterns and user segments.',
    skills: ['Python', 'Clustering', 'Unsupervised ML'],
    links: [{ label: 'GitHub', href: 'https://github.com/Sneharaj7645653/movielens_unsupervised_ml' }],
  },
  {
    title: 'Spotify: Diagnosing Free-Tier Listening Time Decline',
    categories: ['Case Studies', 'Product'],
    role: 'Product Case Study',
    summary: 'Root-cause analysis diagnosing drops in free-tier engagement and outlining targeted retention hypotheses.',
    skills: ['RCA', 'Metrics', 'Retention'],
    links: [{ label: 'Read on Notion', href: 'https://app.notion.com/p/Spotify-Diagnosing-Free-Tier-Listening-Time-Decline-3c03d4401a2a80efac77cbe38eba3809?source=copy_link' }],
  },
  {
    title: 'Google Maps: Making the App More Helpful for Tourists',
    categories: ['Case Studies', 'Product'],
    role: 'Product Case Study',
    summary: 'Product improvement teardown focused on reducing friction and improving discovery for travelers navigating unfamiliar cities.',
    skills: ['Product Improvement', 'UX', 'Discovery'],
    links: [{ label: 'Read on Notion', href: 'https://app.notion.com/p/Google-Maps-Making-the-App-More-Helpful-for-Tourists-3c13d4401a2a804896e2d5647391de80?source=copy_link' }],
  },
  {
    title: 'Helping People Choose More Sustainable Products',
    categories: ['Case Studies', 'Product'],
    role: 'Product Case Study',
    summary: 'Behavioral product design case exploring how to nudge everyday shoppers toward eco-friendly choices without adding friction.',
    skills: ['Behavioral Psych', 'Sustainability', '0-to-1'],
    links: [{ label: 'Read on Notion', href: 'https://app.notion.com/p/Helping-People-Choose-More-Sustainable-Products-3c83d4401a2a805a900cde2600a1d649?source=copy_link' }],
  },
  {
    title: 'Design a Product for College Students',
    categories: ['Case Studies', 'Product'],
    role: 'Product Case Study',
    summary: '0-to-1 product design case study mapping student pain points, user personas, and core MVP workflows.',
    skills: ['Product Design', 'Personas', 'MVP'],
    links: [{ label: 'Read on Notion', href: 'https://app.notion.com/p/Product-Design-Case-Design-a-Product-for-College-Students-3c13d4401a2a8015b14fcef0faea7009?source=copy_link' }],
  },
]

/* -------------------- FOUNDATIONS -------------------- */

export const FOUNDATION_PROFILES = [
  { label: 'GitHub', href: 'https://github.com/Sneharaj7645653' },
  { label: 'LeetCode', href: 'https://leetcode.com/u/sneharaj7645653/' },
  { label: 'Kaggle', href: 'https://www.kaggle.com/sneharaj10295' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sneha-raj-927748332/' },
]

export const FOUNDATION_GROUPS = [
  {
    title: 'AI, ML & GenAI',
    skills: ['Classical ML (CML)', 'Unsupervised ML', 'Deep Learning', 'Computer Vision (CV)', 'NLP', 'GenAI (LangChain & LangGraph)'],
  },
  {
    title: 'Web, Backend & Infra',
    skills: ['HTML & CSS', 'JavaScript', 'React', 'MERN Stack', 'Spring Boot', 'DevOps'],
  },
  {
    title: 'Core CS & Data',
    skills: ['DSA', 'DBMS', 'OS & Networking', 'Data Engineering (Learning Currently 🌱)'],
  },
  {
    title: 'Product & Strategy',
    skills: ['Product Discovery', 'PRDs', 'Roadmapping', 'RICE & JTBD', 'User Interviews', 'Funnel & Cohort Analysis', 'Behavioral Psych', 'Figma'],
  },
]

/* -------------------- JOURNEY -------------------- */

export const MILESTONES = [
  { date: 'Aug 2024 – Present', title: 'Dual B.Sc. CS Degrees', body: 'Enrolled at Scaler School of Technology & BITS Pilani.', icon: '🎓' },
  { date: 'Dec 2024 – Jul 2025', title: 'LDC Product Lead', body: 'Built the NSET AI Assistant & grew a 2,000+ member community.', icon: '🚀' },
  { date: 'Aug 2025 – Present', title: "Core Leadership @ Orators' Society", body: 'Executed the 2026 roadmap — 6 major events in 5 months.', icon: '🎤' },
  { date: 'Aug 2025 – Jun 2026', title: 'Teaching Assistant @ InterviewBit', body: 'Mentored 23 CS students; 61% past the 7.5 CGPA threshold.', icon: '📚' },
  { date: 'May 2026 – Present', title: 'PM Intern @ Cysterhood', body: 'Scaled the web MVP to 100 DAU & a 200+ waitlist.', icon: '🌸' },
]

export const TRIUMPHS = [
  { medal: '🥉', title: '3rd Place · ProdXPulse 2026', sub: 'National AI Product Festival' },
  { medal: '🥈', title: '2nd Place · Ship to Scale', sub: 'Product Hackathon' },
  { medal: '🥇', title: '1st Place · The Devil’s Advocate', sub: 'Speaking Championship · 200+ @ St. Joseph’s' },
  { medal: '🥉', title: '3rd Place · TEDx Speaking', sub: 'Speaking Championship @ St. Francis' },
]

/* -------------------- SANCTUARY -------------------- */

export const BOOK_FILTERS = ['Currently Reading', 'Fiction & Literature', 'Philosophy & Growth']

export const BOOKS = [
  // Currently reading — no quotes yet
  { title: 'A Little Life', author: 'Hanya Yanagihara', rating: 0, category: 'Currently Reading' },
  { title: 'Mrs Dalloway', author: 'Virginia Woolf', rating: 0, category: 'Currently Reading' },
  { title: 'Karmabhoomi', author: 'Munshi Premchand', rating: 0, category: 'Currently Reading' },
  { title: 'Master of the Game', author: 'Sidney Sheldon', rating: 0, category: 'Currently Reading' },

  {
    title: 'Siddhartha', author: 'Hermann Hesse', rating: 5, category: 'Fiction & Literature',
    lines: [
      'The river is everywhere at the same time — at the source and at the mouth, everywhere at once.',
      'Wisdom cannot be imparted. Wisdom that a wise man attempts to impart always sounds like foolishness.',
      'When someone is seeking, it happens quite easily that he only sees the thing that he is seeking.',
    ],
  },
  {
    title: 'A Psalm for the Wild-Built', author: 'Becky Chambers', rating: 5, category: 'Fiction & Literature',
    lines: [
      'You’re allowed to just live. Did you know that?',
      'You keep asking why your work is not enough, and I don’t know how to answer that, because it is enough to exist in the world and marvel at it.',
    ],
  },
  {
    title: '1984', author: 'George Orwell', rating: 5, category: 'Fiction & Literature',
    lines: [
      'War is peace. Freedom is slavery. Ignorance is strength.',
      'If you want a picture of the future, imagine a boot stamping on a human face — forever.',
      'Perhaps one did not want to be loved so much as to be understood.',
    ],
  },
  {
    title: 'The Guide', author: 'R.K. Narayan', rating: 4, category: 'Fiction & Literature',
    lines: [
      '“Velan, it’s raining in the hills. I can feel it coming up under my feet…”',
      'If by avoiding food I should help the trees bloom, and the grass grow, why not do it thoroughly?',
    ],
  },
  {
    title: 'The Picture of Dorian Gray', author: 'Oscar Wilde', rating: 5, category: 'Fiction & Literature',
    lines: [
      'The only way to get rid of a temptation is to yield to it.',
      'Behind every exquisite thing that existed, there was something tragic.',
      'To define is to limit.',
    ],
  },
  {
    title: 'Pride and Prejudice', author: 'Jane Austen', rating: 4, category: 'Fiction & Literature',
    lines: [
      'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.',
      'I could easily forgive his pride, if he had not mortified mine.',
    ],
  },
  {
    title: 'The Alchemist', author: 'Paulo Coelho', rating: 4, category: 'Fiction & Literature',
    lines: [
      'When you want something, all the universe conspires in helping you to achieve it.',
      'The secret of life, though, is to fall seven times and to get up eight times.',
    ],
  },
  {
    title: 'Rangbhoomi', author: 'Munshi Premchand', rating: 4, category: 'Fiction & Literature',
    lines: [
      'सूरदास के पास कुछ नहीं था — बस उसकी ज़मीन और उसकी आत्मा, जिसे कोई खरीद नहीं सकता।',
      'जहाँ अन्याय हो, वहाँ अहिंसा ही सबसे बड़ा बल है।',
    ],
  },
  {
    title: '12th Fail', author: 'Anurag Pathak', rating: 5, category: 'Fiction & Literature',
    lines: [
      'Restart.',
      'Never cheat — not in an exam, and not in life.',
    ],
  },
  {
    title: 'The Bell Jar', author: 'Sylvia Plath', rating: 5, category: 'Fiction & Literature',
    lines: [
      'I took a deep breath and listened to the old brag of my heart. I am, I am, I am.',
      'I saw my life branching out before me like the green fig tree in the story.',
      'I felt very still and very empty, the way the eye of a tornado must feel.',
    ],
  },

  {
    title: 'A Room of One’s Own', author: 'Virginia Woolf', rating: 5, category: 'Philosophy & Growth',
    lines: [
      'A woman must have money and a room of her own if she is to write fiction.',
      'Lock up your libraries if you like; but there is no gate, no lock, no bolt that you can set upon the freedom of my mind.',
    ],
  },
  {
    title: 'The Almanack of Naval Ravikant', author: 'Eric Jorgenson', rating: 5, category: 'Philosophy & Growth',
    lines: [
      'Play long-term games with long-term people.',
      'Desire is a contract you make with yourself to be unhappy until you get what you want.',
      'A calm mind, a fit body, a house full of love — these things cannot be bought.',
    ],
  },
  {
    title: 'Aitareya Upanishad', author: 'Ancient · Rigveda', rating: 5, category: 'Philosophy & Growth',
    lines: [
      'प्रज्ञानं ब्रह्म — चेतना ही ब्रह्म है।',
      'आत्मा वा इदमेक एवाग्र आसीत् — आरंभ में केवल आत्मा ही थी, और कुछ नहीं।',
    ],
  },
  {
    title: 'Atomic Habits', author: 'James Clear', rating: 4, category: 'Philosophy & Growth',
    lines: [
      'You do not rise to the level of your goals. You fall to the level of your systems.',
      'Every action you take is a vote for the type of person you wish to become.',
    ],
  },
  {
    title: 'Atmamun', author: 'Kapil Gupta', rating: 4, category: 'Philosophy & Growth',
    lines: [
      'Truth cannot be taught. It can only be discovered.',
      'Do not seek to feel better. Seek to see what is true.',
    ],
  },
  {
    title: 'Ikigai', author: 'García & Miralles', rating: 4, category: 'Philosophy & Growth',
    lines: [
      'Only staying active will make you want to live a hundred years.',
      'There is no future, no past. There is only the present.',
    ],
  },
]

export const POEMS = [
  {
    title: 'I wish I was less',
    excerpt: 'I think I love you,\nbut do I?',
    body: `And yes, that's how presumptuous I am.

I think I love you,
but do I?
Yes, I do, but without the self—
Not quite sure.

But in every bit, I try—
try to make you happy,
make you feel loved, and loved deeply.

But still, I have plenty that
points to scarcity.

You don't want me or need me;
You pay just some heed
to my pitiful state, or faded face,
or scars healed.

Do you feel the love that I have to offer?

I try to make it as little about me
and all about you, and for you.

But then you say—
you say, you say,
"I feel nothing."

It's alright; I don't even want anything.

But then why, at times, do you appear kind
and willing?

It is alright, but my love isn't divine.
Had it been, it would stand high,
high without a selfish spine.

But no wonder, it is—
it is so corrupt.

So let me love you,
but don't say, at times,
that you do too.

For it turns this magic into witchcraft.

Just say, or say nothing,
but don't lie.

It hurts
like the expected water drop
on forehead a thousand times struck,
offering respite
but destroying this fragile life.`,
  },
  {
    title: 'Falling in love',
    excerpt: 'The blossoming rose was pretty\nSo was the rising sun',
    body: `The blossoming rose was pretty
So was the rising sun
The twinkling stars sparkled
Flowing river, a marvel
All this was beautiful
Pleasant and suitable

But then, I saw them on the ground
Lifeless
Flooring and in abound
Strangely, or Sadly
I smirked at their fall
No thud, but freedom drawled
And then, the dying sun, I thought
Tamed,
With lame brightness spun
No resentment, no guilt
Ready to sublime
Into darkness spilt
Kindred to orbs absorbed
The tale of bleached water
Succumbed to destined halt

Flurried I watched, and thought
Is there any joy in these exalting falls?

Now, having fallen, I smile often
There is no repentance, losing all sense
Into the arms of absolute acceptance`,
  },
  {
    title: 'Just for the spring',
    excerpt: 'My journey began as a seed\nBeneath the earth, dormant, unseen.',
    body: `My journey began as a seed
Beneath the earth, dormant, unseen.
A period so grim
Gurgling life but still on the brim
Following it was growth, fragile but coarse
Then I split into two
Steering my way through, sand shale and clay
While the other, navigating up the ladder
Towards radiance, or dangers veiled
Time passed, shilly-shallied
Roots strengthened, shoots lengthened
Alive but just a tree
Stood through the storm, waving and free
What once was tender and green,
Is now wrinkled and perpetually unclean
That which once hoped for a shelter to grow
Serves a shade to rovers and crows
What once was frail and flimsy
Now stands staunch and sturdy
No prop, no staff
A mere epitome of autonomous, extant
"Now, what?
Why the pain, the toil, the exertion?
Just a selfless slave to serve others?"
No
Through the winters all along,
I had preserved it for the spring
When everything is colourful, preen
That is when beauty sprawls
Uncontrolled and unflawed
Waiting for the opportune fortune
Grating and jarring to nurture the cloying
With utmost wariness, no need, but a want
No necessity but longed
So, now, when it unfolds, the blossoming cherry
Is how I be selfish and greedy
Unforgiving in the care of the petals
Asking for attention
And thus, receiving kisses from flying fairies.`,
  },
  {
    title: 'The fault in my being',
    excerpt: 'A little more—\nI hate myself.',
    body: `A little more—
I hate myself.
A little more—
I like loneliness.
A little more—
I embrace emptiness.
A little more—
I remain unrest.
A little more—
I bear myself.
A little more—
I wake worn.
A little more—
I care less.
A little more—
I live less.
A little more—
I die fresh.
A little more—
I am less.
A little more—
I want early death.`,
  },
  {
    title: 'A friend indeed!',
    excerpt: 'It was mystical, close to cynical\nThe fumes of white, blurring the road out of sight',
    body: `It was mystical, close to cynical
The fumes of white, blurring the road out of sight
The fog in the cold,
Deserted land and a vagabond
Bleak and unkind, night's silence wined
Formidable loneliness, eerie sights,
Unbearable, screeching plight.
But, amidst that hassle, he found a castle
A marvel with stairs like pearl tassels
What a respite!
The wandering soul saw a detour to the inside
Ah, it was sweet, laden with peace
It was warm like a blanket's womb
And comforting like the dark embracing the moon
It was, but a refuge
Soon came the time to bid adieu to the mansion huge
With tear-filled eyes, he left
Left at night breaking dawn
Cereus dozed off, Coreopsis yawned
The worst was gone; it is time for a better morn
Soft breeze blowing over, tingling the corn
Even though it is after the night,
All seems just so alive.
There is no other time so opportune
Finding a way to his fortune.
I, from a distance observed,
Crisp rays falling on the seated dewdrop
Shining like a crystalline cyst
No different from his eyes so preen
Which gleams with dreams and aspirations unseen.

Ripping apart through his emotions' crest.`,
  },
  {
    title: 'The Dearth of Your Presence',
    excerpt: 'For one who has tasted the elixir of eternal death,\nI can’t use the nectar of limited life bait',
    body: `For one who has tasted the elixir of eternal death,
I can't use the nectar of limited life bait
To bring you back to breath.
When has the wanton wind failed to sweep away the tarnished ash?
When has time ever been indisciplined to decay the left, hollow carcass
True is the fact that the sea's water never ends
For not so deep are the wells of my eyes
For I don't bemoan anymore your farewell.
Not because I don't grieve anymore,
But because
My heart knows that the rainfall can't ignite the fire of the soul.
Now, that your body has departed,
Why should I be forced to believe that our souls have separated?
Now, Now that you are gone
I alone water the plant we planted together
And now, it blossoms to rose.
So deep hue it has,
Just as deep infinite eyes you do.
Its petals are so tender;
Just as the moist imprint
Of our last kiss of adieu.
Yes, it's thorns prick me often
Often when I am lost in the beauty of the rose
And thus,
You,
Just a reminder that you are no more here
But our immortal love,
Still new.
The world is now too strange to me,
Or maybe I chose to be estranged.
I am now tangled between fiction and reality
Cause your loving fictitious living fingers are fixed on mine,
Lifeless
I too don't want to lose your grip
But each memory of yours comes along like a whip
Yes, it aches
It aches harder than ever
Though I don't have any willingness to live,
Yet the mere thought of you,
Having tread this earth
Makes me exist
Sometimes, the urge is too strong
To end this humanly limitation and
Mental war
Simply to sublime into your
Soaring soul
Yet, I am here performing your and mine role.`,
  },
  {
    title: 'Not much',
    excerpt: 'Bring me a blade of grass torn delicately apart,\nFor thy jewels won’t win my heart',
    body: `Bring me a blade of grass torn delicately apart,
For thy jewels won't win my heart
I don't aspire for the wealth of the world
But make sure not to bury me alive
Beneath the treacherous loyalty of love.
Worry not, my love, I do not want heaven on earth
For you, I promise to be your abundance in times of dearth
If not enough, then take me whole
My body and thus thy soul.
Well in return what would you offer?
Nothing much, I demand,
Be by my side like the shadow cast of the sinking hour.
However, I feel I be too greedy,
But let me take a step back and say
You be my god and I be your duty
I be the endless ocean and you the precious pearl of pristine beauty.
What if I be the eyes and you the dreams they enclose
And what if you be the moon and I
The scars amplified manifold.`,
  },
  {
    title: 'Unnatural life',
    excerpt: 'Would you know if I die\nOf course, the body will show',
    body: `Would you know if I die
Of course, the body will show
No sinking breath, nor a blinking eye
No growing nails, just skin turning pale
No smacking lips, a puckered face
Free of guilt
A heavy body succumbed to gravity
A face free of worries
A peaceful pallor spread across wrinkled forehead
But what if these don't show?`,
  },
  {
    title: 'An accident',
    excerpt: 'You would never know what happened\nI wouldn’t let you see',
    body: `You would never know what happened
I wouldn't let you see
But the knife
Might someday bemoan the life's cease
Thus, you would not discover
That it was not happenstance
A rainy day, and the hill so slant
It was not merely a calamity
It was destiny woven with trembling hands
It was not per chance
It was thoughtful, clever and nuanced`,
  },
]

export const BADMINTON_STORY =
  'My dad is the reason I ever picked up a racket. He’s a badminton fanatic — most evenings at home ended with him coaxing the whole family down to the nearest court. I started out just to humour him, chasing his drop shots and losing every single rally. But somewhere between the losing and the laughing, I fell for the game myself. Now it’s our thing: a quick match to reset after a long day, a little father–daughter rivalry, and the one place where my mind goes completely quiet.'

export const BADMINTON_WHY =
  'Beyond the fun, it matters to me: a strong, healthy body and a proper refresher after long hours hunched in front of a screen as a CS student. A few games and my head is clear again.'

export const BADMINTON_QUOTE = {
  text: 'We don’t stop playing because we grow old; we grow old because we stop playing.',
  author: 'George Bernard Shaw',
}

export const SUSTAINABILITY_INTRO =
  'I didn’t learn sustainability from a textbook — I grew up with it. In most Indian homes it’s simply tradition: we still cook and eat from steel and brass utensils that are two or three generations old, we repair long before we replace, and we waste almost nothing. Living gently is the default here, not a trend.'

export const SUSTAINABILITY = [
  { emoji: '🌾', title: 'Seed Paper', body: 'I love plantable seed paper — cards and notes you bury after reading, so a simple thank-you can grow into a plant.' },
  { emoji: '🌸', title: 'Phool & Temple Flowers', body: 'Companies like Phool collect the tonnes of flowers offered in temples and turn them into incense and biomaterials instead of letting them choke our rivers — circular thinking rooted in culture.' },
  { emoji: '📗', title: 'A Psalm for the Wild-Built', body: 'Becky Chambers’ book stayed with me: a somewhat quixotic vision, and yet it paints what a world shaped by human consciousness — kind, curious, unhurried — could actually look like.' },
]
