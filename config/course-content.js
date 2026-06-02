// Course module content — used by the course reader + completion tracking.
// Each module: { id: <int>, title: <string>, content: <html string> }
//
// Modules are 1-indexed (id starts at 1) so completion records in the DB
// (completedModules: [1, 3, 5]) are human-readable.

const moduleHTML = (title, obj, story, steps, tip, summary, reflection) => `<h2>${title}</h2>
<h3>🎯 Learning Objectives</h3>
<ul>${obj.map(o => `<li>${o}</li>`).join('')}</ul>
<h3>📖 Core Lesson</h3>${lesson}

<div style="border-left:4px solid #fbbf24;padding-left:12px;margin:12px 0;"><b>IMPORTANT:</b> ${important}</div>
<h3>💡 PRO TIP</h3>
<div style="border-left:4px solid #6366f1;padding-left:12px;margin:12px 0;">${tip}</div>
<h3>🌍 REAL LIFE STORY</h3>
<div style="border-left:4px solid #10b981;padding-left:12px;margin:12px 0;">${story}</div>
<h3>✅ Action Steps</h3>
<ol>${steps.map(s => `<li>${s}</li>`).join('')}</ol>
<h3>📝 Module Summary</h3>
<p>${summary}</p>
<h3>❓ Reflection Question</h3>
<p>${reflection}</p>`;

const courseContent = {
  starter: [
    {
      id: 1,
      title: 'Social Media Basics & Personal Branding',
      content: `<h2>Module 1: Social Media Basics & Personal Branding</h2>
<h3>🎯 Learning Objectives</h3>
<ul>
  <li>Understand what personal branding means in the digital world.</li>
  <li>Learn how to audit and upgrade your Facebook, Instagram, and TikTok profiles.</li>
  <li>Discover what kind of content to post for professional growth.</li>
  <li>Grasp the concept of "digital trust" and why it matters for earning online.</li>
</ul>
<h3>📖 Core Lesson</h3>
<p><b>Personal branding</b> is the process of creating a unique and consistent image of yourself on the internet. In Nepal, where opportunities are increasingly digital, your online presence is often your first impression. Whether you're a student in Pokhara, a homemaker in Biratnagar, or a job seeker in Kathmandu, your Facebook, Instagram, and TikTok profiles are your digital business cards.</p>
<p>When people search your name, what do they find? Employers, clients, and collaborators will check your social media before working with you. A strong personal brand builds <b>digital trust</b>—the confidence others have in your skills, reliability, and professionalism.</p>
<p><b>Auditing and Upgrading Your Profiles</b></p>
<ul>
  <li><b>Profile Photo:</b> Use a clear, friendly, and professional-looking photo. Avoid group shots or blurry images.</li>
  <li><b>Bio:</b> Write a short, honest description of who you are, what you do, and what you're passionate about. Example: "Aspiring digital marketer | Learning every day | DM for collaboration."</li>
  <li><b>Content Pillars:</b> Choose 2–3 topics you want to be known for (e.g., digital skills, motivation, local culture). Post about these regularly.</li>
  <li><b>Consistency:</b> Post at least once a week. Consistency builds recognition and trust.</li>
  <li><b>Personal vs. Professional:</b> It's okay to share personal moments, but keep your main feed focused on your goals and skills.</li>
</ul>
<p><b>Building Digital Trust</b></p>
<ul>
  <li>Respond to comments and messages politely.</li>
  <li>Share your learning journey, not just your achievements.</li>
  <li>Avoid sharing fake news or controversial content.</li>
  <li>Support others in your network.</li>
</ul>
<div style="border-left:4px solid #fbbf24;padding-left:12px;margin:12px 0;"><b>IMPORTANT:</b> Your online presence is permanent. Think before you post—would you be proud to show this to a future employer or client?</div>
<h3>💡 PRO TIP</h3>
<div style="border-left:4px solid #6366f1;padding-left:12px;margin:12px 0;">Use the same profile photo and similar bios across all platforms. This makes you instantly recognizable and strengthens your brand.</div>
<h3>🌍 REAL LIFE STORY</h3>
<div style="border-left:4px solid #10b981;padding-left:12px;margin:12px 0;">Sita, a 19-year-old student from Pokhara, started sharing her journey of learning graphic design on Instagram. She posted her projects, shared tips, and engaged with others in the field. Within six months, a local business owner noticed her work and offered her a paid freelance project. Sita's consistent, positive, and skill-focused online presence turned her hobby into a source of income.</div>
<h3>✅ Action Steps</h3>
<ol>
  <li>Audit your Facebook, Instagram, and TikTok profiles today. Remove anything unprofessional.</li>
  <li>Update your bio and profile photo within the next week.</li>
  <li>Make it a habit to post about your learning or work at least once a week.</li>
</ol>
<h3>📝 Module Summary</h3>
<p>Personal branding is your digital reputation. By curating your profiles, posting consistently, and focusing on your strengths, you build trust and open doors to online opportunities. Remember, your online presence is your new CV—make it count!</p>
<h3>❓ Reflection Question</h3>
<p>What does your current online presence say about you, and what would you like it to say in six months?</p>`
    },
    {
      id: 2,
      title: 'Communication Skills for Online Work',
      content: `<h2>Module 2: Communication Skills for Online Work</h2>
<h3>🎯 Learning Objectives</h3>
<ul>
  <li>Learn how to write professional messages in English and Nepali.</li>
  <li>Understand the difference between casual chat and business communication.</li>
  <li>Master the basics of email etiquette and proposal writing.</li>
  <li>Handle misunderstandings and client inquiries gracefully.</li>
</ul>
<h3>📖 Core Lesson</h3>
<p><b>The Power of Professional Communication</b> — In the digital world, your words are your handshake. Whether you're chatting on WhatsApp, sending an email, or replying to a client on Facebook, clear and polite communication sets you apart.</p>
<p><b>Writing Professional Messages</b></p>
<ul>
  <li><b>Greetings:</b> Always start with a polite greeting. ("Namaste, hope you are well…")</li>
  <li><b>Clarity:</b> Be concise but complete. Answer all questions in one message.</li>
  <li><b>Tone:</b> Use polite language. Avoid slang or overly casual words.</li>
  <li><b>Language:</b> If you're more comfortable in Nepali, that's fine—just keep it respectful and clear.</li>
</ul>
<p><b>Email Etiquette</b></p>
<ul>
  <li>Use a clear subject line. Start with a greeting. Keep paragraphs short.</li>
  <li>End with a closing ("Best regards, Suman").</li>
  <li>Proofread before sending.</li>
</ul>
<p><b>Writing a Simple Proposal</b></p>
<ul>
  <li>Introduce yourself. State what you can do. Mention your experience or skills. Ask for the next steps.</li>
</ul>
<p><b>Handling Misunderstandings</b></p>
<ul>
  <li>Stay calm and polite. Clarify the issue. Apologize if needed. Offer a solution.</li>
</ul>
<p>Reply within 24 hours whenever possible. Quick responses show professionalism and respect.</p>
<div style="border-left:4px solid #fbbf24;padding-left:12px;margin:12px 0;"><b>IMPORTANT:</b> Never argue online with a client, even if you are right. Stay calm, ask questions, and find a solution.</div>
<h3>💡 PRO TIP</h3>
<div style="border-left:4px solid #6366f1;padding-left:12px;margin:12px 0;">Save templates for common messages (introductions, proposals, follow-ups) so you can respond quickly and professionally every time.</div>
<h3>🌍 REAL LIFE STORY</h3>
<div style="border-left:4px solid #10b981;padding-left:12px;margin:12px 0;">Ramesh, a job seeker from Biratnagar, applied for a remote data entry job. He wrote a clear, polite email introducing himself and attached his CV. The employer was impressed by his professionalism and quick replies. Even when there was a misunderstanding about the work hours, Ramesh handled it calmly and clarified the details. He got the job—and a reputation for being reliable.</div>
<h3>✅ Action Steps</h3>
<ol>
  <li>Write a professional introduction message and save it as a template.</li>
  <li>Send a follow-up message to someone you've contacted in the past week.</li>
  <li>Make it a habit to reply to all work-related messages within 24 hours.</li>
</ol>
<h3>📝 Module Summary</h3>
<p>Professional communication is the foundation of online work. By using clear language, polite tone, and quick responses, you build trust and increase your chances of success. Templates and good habits make it easier over time.</p>
<h3>❓ Reflection Question</h3>
<p>How would you feel if you received your own messages? What could you improve to sound more professional?</p>`
    },
    {
      id: 3,
      title: 'Mindset & Goal Setting',
      content: `<h2>Module 3: Mindset & Goal Setting</h2>
<h3>🎯 Learning Objectives</h3>
<ul>
  <li>Understand the difference between a growth mindset and a fixed mindset.</li>
  <li>Learn why most beginners quit and how to avoid it.</li>
  <li>Apply the SMART goal framework to online income.</li>
  <li>Build daily habits for digital success.</li>
</ul>
<h3>📖 Core Lesson</h3>
<p>A <b>growth mindset</b> means believing you can learn and improve with effort. A <b>fixed mindset</b> believes your abilities are set and can't change. In digital work, a growth mindset helps you overcome challenges and keep learning.</p>
<p><b>Why Most Beginners Quit</b></p>
<ul>
  <li>They expect quick results.</li>
  <li>They get discouraged by failure.</li>
  <li>They compare themselves to others.</li>
</ul>
<p><b>SMART Goals for Online Income</b></p>
<ul>
  <li><b>Specific:</b> "I want to earn Rs. 2,000 from freelancing in 2 months."</li>
  <li><b>Measurable:</b> Track your earnings and progress.</li>
  <li><b>Achievable:</b> Start with realistic targets.</li>
  <li><b>Relevant:</b> Choose goals that matter to you.</li>
  <li><b>Time-bound:</b> Set a deadline.</li>
</ul>
<p><b>Dealing with Imposter Syndrome</b> — Everyone feels like a beginner at first. Remember, every expert was once a beginner. Focus on progress, not perfection.</p>
<div style="border-left:4px solid #fbbf24;padding-left:12px;margin:12px 0;"><b>IMPORTANT:</b> The hardest part of any journey is showing up when you don't feel like it. Build the habit first, the results follow.</div>
<h3>💡 PRO TIP</h3>
<div style="border-left:4px solid #6366f1;padding-left:12px;margin:12px 0;">Write your goals on paper and keep them visible. This daily reminder keeps you focused and motivated.</div>
<h3>🌍 REAL LIFE STORY</h3>
<div style="border-left:4px solid #10b981;padding-left:12px;margin:12px 0;">Anita, a homemaker in Kathmandu, wanted to start earning online but felt overwhelmed. She set a SMART goal: "Earn Rs. 1,000 from data entry in 30 days." She joined a Facebook group for support and checked in with a friend every week. Even when she faced setbacks, her growth mindset and accountability partner kept her going. She reached her goal in three weeks.</div>
<h3>✅ Action Steps</h3>
<ol>
  <li>Write down one SMART goal for your online journey today.</li>
  <li>Find an accountability partner and share your goal within a week.</li>
  <li>Review your progress every Sunday and adjust your plan as needed.</li>
</ol>
<h3>📝 Module Summary</h3>
<p>A growth mindset and clear goals are the keys to digital success. By setting SMART goals, building daily habits, and seeking support, you can overcome challenges and achieve your dreams.</p>
<h3>❓ Reflection Question</h3>
<p>What is one limiting belief you have about yourself, and how can you reframe it with a growth mindset?</p>`
    },
    {
      id: 4,
      title: 'Introduction to Online Earning Methods',
      content: `<h2>Module 4: Introduction to Online Earning Methods</h2>
<h3>🎯 Learning Objectives</h3>
<ul>
  <li>Discover 8+ ways to earn money online.</li>
  <li>Understand the skills and platforms needed for each method.</li>
  <li>Learn how to choose the best method for your situation.</li>
  <li>Set realistic expectations for time to first earning.</li>
</ul>
<h3>📖 Core Lesson</h3>
<p><b>1. Freelancing</b> — Offer your skills (writing, design, data entry) to clients worldwide. Platforms: Upwork, Fiverr, Freelancer. Time to first earning: 2–8 weeks.</p>
<p><b>2. Affiliate Marketing</b> — Promote products and earn a commission for each sale. Platforms: Daraz Affiliate, Amazon Associates. Time: 1–3 months.</p>
<p><b>3. Content Creation</b> — Make videos, blogs, or podcasts and earn from ads or sponsorships. Platforms: YouTube, TikTok, Blogspot. Time: 2–6 months.</p>
<p><b>4. Referral Programs</b> — Invite others to join a platform and earn a bonus. Platforms: This course, eSewa, Khalti. Time: 1–4 weeks.</p>
<p><b>5. Online Tutoring</b> — Teach subjects or skills online. Platforms: Teachmint, Zoom, Facebook Live. Time: 2–6 weeks.</p>
<p><b>6. Data Entry</b> — Enter data for companies or researchers. Platforms: Upwork, Freelancer, local job boards. Time: 2–4 weeks.</p>
<p><b>7. Social Media Management</b> — Manage social media pages for businesses. Platforms: Facebook, Instagram, LinkedIn. Time: 1–3 months.</p>
<p><b>8. Reselling</b> — Buy products in bulk and sell online. Platforms: Daraz, Facebook Marketplace. Time: 2–6 weeks.</p>
<p><b>Choosing the Best Method</b> — Assess your skills and interests. Start with one method and master it before trying others.</p>
<div style="border-left:4px solid #fbbf24;padding-left:12px;margin:12px 0;"><b>IMPORTANT:</b> Beware of scams. Never pay to get a job. Research platforms before joining.</div>
<h3>💡 PRO TIP</h3>
<div style="border-left:4px solid #6366f1;padding-left:12px;margin:12px 0;">Join Facebook groups related to your chosen method. You'll find tips, job leads, and support from others.</div>
<h3>🌍 REAL LIFE STORY</h3>
<div style="border-left:4px solid #10b981;padding-left:12px;margin:12px 0;">Bikash, a college student in Kathmandu, tried freelancing, affiliate marketing, and content creation. He found he enjoyed making TikTok videos the most. After three months of consistent posting, he started earning from brand partnerships. By focusing on one method, he turned his passion into profit.</div>
<h3>✅ Action Steps</h3>
<ol>
  <li>Research two online earning methods that interest you today.</li>
  <li>Join one Facebook group related to your chosen method this week.</li>
  <li>Commit to learning and practicing your chosen method every day.</li>
</ol>
<h3>📝 Module Summary</h3>
<p>There are many ways to earn online, each with its own skills and platforms. By exploring your options and focusing on one method, you can start your digital income journey with confidence.</p>
<h3>❓ Reflection Question</h3>
<p>Which online earning method excites you the most, and what is your first step to get started?</p>`
    },
    {
      id: 5,
      title: 'How Referral Networks Work',
      content: `<h2>Module 5: How Referral Networks Work</h2>
<h3>🎯 Learning Objectives</h3>
<ul>
  <li>Understand the mechanics of referral systems and commissions.</li>
  <li>Learn how to promote platforms ethically and effectively.</li>
  <li>Discover how to build trust and track your referrals.</li>
  <li>Develop a long-term referral strategy.</li>
</ul>
<h3>📖 Core Lesson</h3>
<p>A <b>referral system</b> rewards you for inviting others to join a platform. You get a unique link or code. When someone joins using your link, you earn a commission.</p>
<p><b>Commissions and Multi-Level Referrals</b></p>
<ul>
  <li><b>Direct Referral:</b> You earn when someone joins directly through your link.</li>
  <li><b>Multi-Level:</b> You may also earn a smaller commission when your referrals invite others.</li>
  <li><b>Calculation:</b> Commissions are usually a percentage of the sale or a fixed bonus.</li>
</ul>
<p><b>Ethics of Promoting Platforms</b></p>
<ul>
  <li>Only promote platforms you trust and use yourself.</li>
  <li>Be honest about the benefits and limitations.</li>
  <li>Never pressure or mislead people.</li>
</ul>
<p><b>Sharing Your Referral Link</b></p>
<ul>
  <li>Share your story—why did you join?</li>
  <li>Use social media, WhatsApp, and word of mouth.</li>
  <li>Avoid spamming groups or sending unsolicited messages.</li>
</ul>
<p><b>Long-Term Referral Strategy</b> — Focus on quality, not just quantity. Build relationships with your network. Keep learning and improving your approach.</p>
<div style="border-left:4px solid #fbbf24;padding-left:12px;margin:12px 0;"><b>IMPORTANT:</b> Your reputation is your most valuable asset. Protect it by being ethical and supportive.</div>
<h3>💡 PRO TIP</h3>
<div style="border-left:4px solid #6366f1;padding-left:12px;margin:12px 0;">Create a simple welcome message for new referrals. Offer to help them get started and answer their questions.</div>
<h3>🌍 REAL LIFE STORY</h3>
<div style="border-left:4px solid #10b981;padding-left:12px;margin:12px 0;">Sunita from Biratnagar joined a referral program for an online course. She shared her experience on Facebook and WhatsApp, focusing on how the course helped her. Instead of spamming, she answered questions and supported her referrals. Over six months, she built a network of 20 active members and earned steady commissions.</div>
<h3>✅ Action Steps</h3>
<ol>
  <li>Write your personal story about why you joined a platform.</li>
  <li>Share your referral link with three friends this week, focusing on helping them.</li>
  <li>Track your referrals in a notebook or spreadsheet and follow up regularly.</li>
</ol>
<h3>📝 Module Summary</h3>
<p>Referral networks are a powerful way to earn online, but success comes from trust, ethics, and support. By focusing on relationships and providing value, you can build a sustainable income stream.</p>
<h3>❓ Reflection Question</h3>
<p>How can you add value to your network before asking them to join or buy something?</p>`
    },
    {
      id: 6,
      title: 'Building Your First Online Project',
      content: `<h2>Module 6: Building Your First Online Project</h2>
<h3>🎯 Learning Objectives</h3>
<ul>
  <li>Pick a simple, low-risk first project you can finish in a week.</li>
  <li>Plan the project: goal, audience, deliverable, deadline.</li>
  <li>Ship it publicly so you can show real work to future clients.</li>
  <li>Use the feedback loop to improve and pick the next project.</li>
</ul>
<h3>📖 Core Lesson</h3>
<p>The fastest way to learn is to <b>ship something real</b>. Theory matters, but nothing beats finishing a project end-to-end. Your first project doesn't need to be perfect — it needs to be <b>done</b>.</p>
<p><b>Picking a Starter Project</b></p>
<ul>
  <li>Choose something you can finish in 3–7 days.</li>
  <li>Examples: a Facebook page with 30 days of posts, a WhatsApp broadcast list, a one-page website, a short YouTube series, a Canva carousel guide.</li>
  <li>Pick the smallest version of a real goal — not a "someday" idea.</li>
</ul>
<p><b>Project Plan Template</b></p>
<ul>
  <li><b>Goal:</b> What does "done" look like? (e.g. "Post 10 reels in 2 weeks")</li>
  <li><b>Audience:</b> Who is it for?</li>
  <li><b>Tools:</b> What do you need? (Phone, Canva, Notion, etc.)</li>
  <li><b>Deadline:</b> Pick a date and stick to it.</li>
</ul>
<p><b>Shipping Publicly</b> — Post your work on Facebook, Instagram, or LinkedIn. Ask for feedback. Document the process. Future clients hire people who have proof, not just ideas.</p>
<p><b>The Feedback Loop</b> — After shipping, ask three people: "What would make this better?" Apply the best feedback to your next project. Repeat.</p>
<div style="border-left:4px solid #fbbf24;padding-left:12px;margin:12px 0;"><b>IMPORTANT:</b> Done is better than perfect. A finished imperfect project beats an unfinished "perfect" one every time.</div>
<h3>💡 PRO TIP</h3>
<div style="border-left:4px solid #6366f1;padding-left:12px;margin:12px 0;">Set a public deadline. Tell your friends or post "I'm shipping X by Friday" — accountability turns plans into outcomes.</div>
<h3>🌍 REAL LIFE STORY</h3>
<div style="border-left:4px solid #10b981;padding-left:12px;margin:12px 0;">Bipin, a 22-year-old from Butwal, had never posted a video online. He decided to post one Canva-made short every day for 30 days. Most got 30 views. By day 25, one reel hit 12,000 views and a local café asked him to run their Instagram. The first 29 videos were "practice" — the 30th opened a door.</div>
<h3>✅ Action Steps</h3>
<ol>
  <li>Pick a starter project today and write a 1-line goal.</li>
  <li>Set a public deadline within the next 7 days.</li>
  <li>Share the finished project on at least one social platform.</li>
</ol>
<h3>📝 Module Summary</h3>
<p>Shipping your first project is the bridge between learning and earning. Pick small, finish fast, post publicly, and use feedback to grow. The first project is practice — the tenth is profit.</p>
<h3>❓ Reflection Question</h3>
<p>What's one project you've been "planning" for months? What would the smallest shippable version look like?</p>`
    }
  ],

  prime: [
    {
      id: 1,
      title: 'Advanced Referral Strategies',
      content: `<h2>Module 1: Advanced Referral Strategies</h2>
<h3>🎯 Learning Objectives</h3>
<ul>
  <li>Understand why most referrals fail and how to fix it.</li>
  <li>Learn the psychology of persuasion: social proof, scarcity, authority.</li>
  <li>Master the follow-up sequence and objection handling.</li>
  <li>Build a funnel using WhatsApp/Telegram/Facebook Groups.</li>
</ul>
<h3>📖 Core Lesson</h3>
<p><b>Why Most Referrals Fail</b> — Most people share a link and hope for the best. But real success comes from understanding human psychology and building trust. Referrals fail when: the message is generic or spammy; there's no social proof; the follow-up is weak; objections are ignored.</p>
<p><b>The Psychology of Persuasion</b></p>
<ul>
  <li><b>Social Proof:</b> People trust what others have tried. Share real testimonials, screenshots, or stories.</li>
  <li><b>Scarcity:</b> Limited-time offers or spots create urgency.</li>
  <li><b>Authority:</b> Show your expertise or results to build credibility.</li>
</ul>
<p><b>The Follow-Up Sequence</b></p>
<ul>
  <li>1st message: Share your story and invite questions.</li>
  <li>2nd message (2 days later): Share a testimonial or result.</li>
  <li>3rd message (1 week later): Ask if they have questions or need help.</li>
  <li>4th message: Respect their decision, but keep them in your network.</li>
</ul>
<p><b>Handling Objections</b></p>
<ul>
  <li>"Is this a scam?" — Share your experience and proof.</li>
  <li>"I have no time." — Show how little time is needed.</li>
  <li>"I have no money." — Explain the return on investment and payment options.</li>
</ul>
<div style="border-left:4px solid #fbbf24;padding-left:12px;margin:12px 0;"><b>IMPORTANT:</b> Always follow up. 80% of conversions happen on the 2nd-5th contact, not the first message.</div>
<h3>💡 PRO TIP</h3>
<div style="border-left:4px solid #6366f1;padding-left:12px;margin:12px 0;">Keep a spreadsheet of everyone you contact, their responses, and follow-up dates. This keeps your outreach organized and effective.</div>
<h3>🌍 REAL LIFE STORY</h3>
<div style="border-left:4px solid #10b981;padding-left:12px;margin:12px 0;">Prakash from Kathmandu started by sharing his referral link on Facebook, but got little response. He changed his approach: created a WhatsApp group, shared his own earnings, and posted testimonials from friends. He followed up with each person, answered questions, and addressed concerns. Within two months, he had 15 active referrals and doubled his income.</div>
<h3>✅ Action Steps</h3>
<ol>
  <li>Write your own testimonial post with a real photo.</li>
  <li>Create a group chat for interested people this week.</li>
  <li>Track your outreach and follow-ups in a spreadsheet.</li>
</ol>
<h3>📝 Module Summary</h3>
<p>Advanced referral strategies rely on psychology, trust, and consistent follow-up. By sharing real stories, building community, and handling objections, you can dramatically increase your referral success.</p>
<h3>❓ Reflection Question</h3>
<p>What's one objection you've faced in referrals, and how can you address it better next time?</p>`
    },
    {
      id: 2,
      title: 'Target Audience & Marketing Basics',
      content: `<h2>Module 2: Target Audience & Marketing Basics</h2>
<h3>🎯 Learning Objectives</h3>
<ul>
  <li>Define your target audience and create a simple buyer persona.</li>
  <li>Learn the 3 key questions every audience has.</li>
  <li>Master content marketing basics and the AIDA formula.</li>
  <li>Write Facebook posts that generate leads.</li>
</ul>
<h3>📖 Core Lesson</h3>
<p>Your target audience is the group of people most likely to benefit from your offer. Knowing your audience helps you create messages that resonate and convert.</p>
<p><b>Creating a Buyer Persona</b></p>
<ul>
  <li>Age, location, job, interests.</li>
  <li>Pain points: What problems do they have?</li>
  <li>Goals: What do they want to achieve?</li>
</ul>
<p><b>The 3 Questions Every Audience Has</b></p>
<ol>
  <li>What is it?</li>
  <li>Why should I care?</li>
  <li>What do I do next?</li>
</ol>
<p><b>The AIDA Formula</b></p>
<ul>
  <li><b>Attention:</b> Grab with a bold statement or question.</li>
  <li><b>Interest:</b> Share a story or benefit.</li>
  <li><b>Desire:</b> Show results or testimonials.</li>
  <li><b>Action:</b> Tell them exactly what to do next.</li>
</ul>
<p><b>Writing a Facebook Post That Generates Leads</b></p>
<ul>
  <li>Start with a hook: "Are you tired of…?"</li>
  <li>Share your story or a client's result.</li>
  <li>End with a call to action: "Comment 'info' if you want to learn more."</li>
</ul>
<p><b>Hashtags and Storytelling</b> — Use 2–5 relevant hashtags to increase reach. Tell stories, not just facts—people remember stories.</p>
<div style="border-left:4px solid #fbbf24;padding-left:12px;margin:12px 0;"><b>IMPORTANT:</b> Speak to one person, not "everyone." Specific messages always outperform generic ones.</div>
<h3>💡 PRO TIP</h3>
<div style="border-left:4px solid #6366f1;padding-left:12px;margin:12px 0;">Use Facebook Insights to see which posts get the most engagement. Double down on what works.</div>
<h3>🌍 REAL LIFE STORY</h3>
<div style="border-left:4px solid #10b981;padding-left:12px;margin:12px 0;">Mina, a homemaker in Lalitpur, wanted to earn online but struggled to get responses. She created a buyer persona: women aged 25–40, interested in flexible income. She wrote posts addressing their challenges and shared her own journey. Her posts started getting more comments and leads, and she built a supportive community.</div>
<h3>✅ Action Steps</h3>
<ol>
  <li>Write a buyer persona for your ideal referral today.</li>
  <li>Draft a Facebook post using the AIDA formula this week.</li>
  <li>Review your post engagement every Sunday and adjust your strategy.</li>
</ol>
<h3>📝 Module Summary</h3>
<p>Knowing your audience and crafting targeted messages is the foundation of digital marketing. Use stories, the AIDA formula, and regular reviews to attract and convert more leads.</p>
<h3>❓ Reflection Question</h3>
<p>Who is your ideal audience, and what problem can you solve for them?</p>`
    },
    {
      id: 3,
      title: 'Free Tools for Digital Workers',
      content: `<h2>Module 3: Free Tools for Digital Workers</h2>
<h3>🎯 Learning Objectives</h3>
<ul>
  <li>Discover 10+ free tools for digital work.</li>
  <li>Learn what each tool does and how to get started.</li>
  <li>Apply practical use cases for each tool.</li>
</ul>
<h3>📖 Core Lesson</h3>
<p><b>Essential Free Tools</b></p>
<ol>
  <li><b>Canva</b> — Design graphics, social posts, and presentations. Start with templates and drag-and-drop editing.</li>
  <li><b>Google Workspace</b> — Docs, Sheets, Forms, Calendar. Collaborate in real time, store files in the cloud.</li>
  <li><b>Notion</b> — Project management, notes, and databases. Organize your work and track progress.</li>
  <li><b>Trello</b> — Visual task tracking with boards and cards. Great for managing projects and teams.</li>
  <li><b>Telegram</b> — Community management, group chats, and channels. Share updates and resources.</li>
  <li><b>CapCut</b> — Free video editing for TikTok, YouTube, and Instagram.</li>
  <li><b>Linktree</b> — Create a single link for all your social profiles and offers.</li>
  <li><b>Mailchimp</b> — Email marketing, newsletters, and audience management.</li>
  <li><b>Bitly</b> — Shorten and track links for better analytics.</li>
  <li><b>ChatGPT</b> — Writing assistance, brainstorming, and research.</li>
</ol>
<p><b>How to Get Started</b> — Search for each tool online and sign up for a free account. Explore tutorials on YouTube for step-by-step guides. Start with one tool and master it before adding more.</p>
<div style="border-left:4px solid #fbbf24;padding-left:12px;margin:12px 0;"><b>IMPORTANT:</b> Don't tool-hop. Pick 2–3 tools that match your workflow and stick with them for at least a month.</div>
<h3>💡 PRO TIP</h3>
<div style="border-left:4px solid #6366f1;padding-left:12px;margin:12px 0;">Bookmark all your essential tools in a browser folder for quick access.</div>
<h3>🌍 REAL LIFE STORY</h3>
<div style="border-left:4px solid #10b981;padding-left:12px;margin:12px 0;">Suman, a freelancer in Pokhara, struggled to keep track of his projects and clients. He started using Notion for project management and Google Calendar for deadlines. Within a month, he felt more organized, missed fewer deadlines, and his client satisfaction improved.</div>
<h3>✅ Action Steps</h3>
<ol>
  <li>Sign up for one new tool from the list today.</li>
  <li>Watch a YouTube tutorial for that tool this week.</li>
  <li>Use the tool daily for a week to build the habit.</li>
</ol>
<h3>📝 Module Summary</h3>
<p>Free digital tools can save you time, keep you organized, and help you grow your online income. Start with one, master it, and gradually build your digital toolkit.</p>
<h3>❓ Reflection Question</h3>
<p>Which tool could make your digital work easier, and how will you start using it this week?</p>`
    },
    {
      id: 4,
      title: 'Tracking Your Growth & Earnings',
      content: `<h2>Module 4: Tracking Your Growth & Earnings</h2>
<h3>🎯 Learning Objectives</h3>
<ul>
  <li>Understand why tracking is essential for success.</li>
  <li>Learn how to build a simple referral tracking sheet.</li>
  <li>Identify key metrics and review your progress.</li>
</ul>
<h3>📖 Core Lesson</h3>
<p>Successful digital earners don't guess—they measure. Tracking helps you see what's working, what's not, and where to focus your efforts.</p>
<p><b>Building a Referral Tracking Sheet</b> — Use Google Sheets or Excel. Columns: Name, Contact, Date Contacted, Response, Joined (Y/N), Earnings. Update after every outreach or referral.</p>
<p><b>Key Metrics to Track</b></p>
<ul>
  <li><b>Reach:</b> How many people saw your message?</li>
  <li><b>Clicks:</b> How many clicked your link?</li>
  <li><b>Conversions:</b> How many joined or bought?</li>
  <li><b>Earnings:</b> How much did you make?</li>
</ul>
<p><b>Weekly vs. Monthly Reviews</b> — Weekly: Quick check-in on progress and challenges. Monthly: Deeper review, set new goals, celebrate wins.</p>
<p><b>Setting Income Milestones</b> — Break big goals into smaller steps (e.g., Rs. 1,000, then Rs. 5,000, then Rs. 10,000).</p>
<div style="border-left:4px solid #fbbf24;padding-left:12px;margin:12px 0;"><b>IMPORTANT:</b> What gets measured gets managed. Even a 2-minute daily log makes a difference over weeks.</div>
<h3>💡 PRO TIP</h3>
<div style="border-left:4px solid #6366f1;padding-left:12px;margin:12px 0;">Set a recurring reminder in Google Calendar for your weekly and monthly reviews.</div>
<h3>🌍 REAL LIFE STORY</h3>
<div style="border-left:4px solid #10b981;padding-left:12px;margin:12px 0;">Priya, a digital marketer in Kathmandu, started tracking her outreach and earnings in Google Sheets. She noticed that her Instagram stories brought more referrals than Facebook posts. By focusing on Instagram, she doubled her conversions in two months.</div>
<h3>✅ Action Steps</h3>
<ol>
  <li>Create a referral tracking sheet in Google Sheets today.</li>
  <li>Set a weekly review reminder in your calendar.</li>
  <li>Share your progress with a friend or mentor every month.</li>
</ol>
<h3>📝 Module Summary</h3>
<p>Tracking your growth and earnings turns guesswork into strategy. By measuring your actions and results, you can focus on what works and achieve your goals faster.</p>
<h3>❓ Reflection Question</h3>
<p>What's one metric you haven't tracked before that could help you grow faster?</p>`
    },
    {
      id: 5,
      title: 'Building Your Team & Network',
      content: `<h2>Module 5: Building Your Team & Network</h2>
<h3>🎯 Learning Objectives</h3>
<ul>
  <li>Understand the difference between a network and a community.</li>
  <li>Learn how to onboard and support new referrals.</li>
  <li>Master group culture, online events, and recognition strategies.</li>
</ul>
<h3>📖 Core Lesson</h3>
<p><b>Network vs. Community</b> — A network is a group of people connected to you. A community is a group with shared goals, support, and culture.</p>
<p><b>Onboarding New Referrals</b></p>
<ul>
  <li>Welcome them personally.</li>
  <li>Share a quick-start guide or checklist.</li>
  <li>Introduce them to the group.</li>
</ul>
<p><b>Creating Group Culture</b></p>
<ul>
  <li>Set norms: Be supportive, share wins, ask questions.</li>
  <li>Encourage sharing and collaboration.</li>
  <li>Address negativity quickly and fairly.</li>
</ul>
<p><b>Hosting Online Events</b> — Zoom calls, Facebook Live, webinars. Share tips, answer questions, celebrate wins. Record sessions for those who can't attend.</p>
<p><b>Recognizing and Rewarding Top Performers</b> — Shoutouts in the group. Small prizes or certificates. Feature their stories in your posts.</p>
<div style="border-left:4px solid #fbbf24;padding-left:12px;margin:12px 0;"><b>IMPORTANT:</b> Always praise in public, address issues in private. That's the golden rule of online community management.</div>
<h3>💡 PRO TIP</h3>
<div style="border-left:4px solid #6366f1;padding-left:12px;margin:12px 0;">Create a monthly "Hall of Fame" post to recognize top contributors and inspire others.</div>
<h3>🌍 REAL LIFE STORY</h3>
<div style="border-left:4px solid #10b981;padding-left:12px;margin:12px 0;">Deepak, a network leader in Chitwan, started hosting weekly Zoom calls for his team. He welcomed new members, shared tips, and celebrated small wins. Over six months, his group became more active, referrals increased, and members felt more connected.</div>
<h3>✅ Action Steps</h3>
<ol>
  <li>Welcome a new member personally this week.</li>
  <li>Host or attend an online event for your group.</li>
  <li>Recognize someone's contribution publicly every month.</li>
</ol>
<h3>📝 Module Summary</h3>
<p>Building a strong team and community multiplies your results. By onboarding, supporting, and recognizing members, you create a culture of growth and success.</p>
<h3>❓ Reflection Question</h3>
<p>How can you make your network feel more like a supportive community?</p>`
    },
    {
      id: 6,
      title: 'Advanced Funnel Building & Conversions',
      content: `<h2>Module 6: Advanced Funnel Building & Conversions</h2>
<h3>🎯 Learning Objectives</h3>
<ul>
  <li>Map a digital funnel from first click to paying customer.</li>
  <li>Write landing pages and lead magnets that actually convert.</li>
  <li>Use email + WhatsApp sequences to nurture leads.</li>
  <li>Test, measure, and improve every step of the funnel.</li>
</ul>
<h3>📖 Core Lesson</h3>
<p>A <b>funnel</b> is the path a stranger walks: see your post → click → join a list → receive a message → buy. Most people skip the middle. Winners don't.</p>
<p><b>The 4-Stage Digital Funnel</b></p>
<ul>
  <li><b>Awareness:</b> Reels, posts, ads — they discover you.</li>
  <li><b>Interest:</b> Free guide, free webinar, free checklist — they raise their hand.</li>
  <li><b>Decision:</b> WhatsApp / email follow-up with proof and answers.</li>
  <li><b>Action:</b> Clear, single offer with one button.</li>
</ul>
<p><b>Lead Magnets That Work</b></p>
<ul>
  <li>Free PDF: "5 ways to earn your first ₹1,000 online"</li>
  <li>Free WhatsApp group: "Daily digital tips for 7 days"</li>
  <li>Free short video course (3 lessons)</li>
  <li>Free audit: "I'll review your Facebook page and send 3 fixes"</li>
</ul>
<p><b>Follow-Up Sequences</b> — Day 0: deliver the lead magnet. Day 1: share a story. Day 3: offer a paid product. Day 7: last-call bonus. Most sales happen on message 2–4, not 1.</p>
<p><b>Measuring the Funnel</b> — Track views → clicks → leads → sales. Find the weakest step (biggest drop) and fix that one first.</p>
<div style="border-left:4px solid #fbbf24;padding-left:12px;margin:12px 0;"><b>IMPORTANT:</b> A funnel is only as strong as its weakest step. If 1,000 people see your post but only 5 click, the post is the problem — not the offer.</div>
<h3>💡 PRO TIP</h3>
<div style="border-left:4px solid #6366f1;padding-left:12px;margin:12px 0;">Build the simplest funnel that works first. One lead magnet + one WhatsApp list + one offer. Run it for 30 days. Optimize later.</div>
<h3>🌍 REAL LIFE STORY</h3>
<div style="border-left:4px solid #10b981;padding-left:12px;margin:12px 0;">Anish from Lalitpur was getting 200+ reactions on his Facebook posts but no sales. He added a free PDF ("3 mistakes Nepalese freelancers make") and a WhatsApp follow-up sequence. Within 3 weeks, he had 60 leads and 8 sales. Same audience — better funnel.</div>
<h3>✅ Action Steps</h3>
<ol>
  <li>Map your current funnel: where do people drop off?</li>
  <li>Create a simple lead magnet (free PDF or checklist) this week.</li>
  <li>Set up a 4-message WhatsApp or email follow-up sequence.</li>
</ol>
<h3>📝 Module Summary</h3>
<p>Traffic without a funnel is wasted attention. By building a clear 4-stage path — awareness, interest, decision, action — and following up with a real sequence, you turn viewers into customers and customers into repeat buyers.</p>
<h3>❓ Reflection Question</h3>
<p>What's the single weakest step in your current funnel, and what's the one change that would most improve it?</p>`
    }
  ],

  master: [
    {
      id: 1,
      title: 'Leadership & Team Management',
      content: `<h2>Module 1: Leadership & Team Management</h2>
<h3>🎯 Learning Objectives</h3>
<ul>
  <li>Lead distributed digital teams with clarity and empathy.</li>
  <li>Set team goals, KPIs, and weekly rhythms that work remotely.</li>
  <li>Recruit, onboard, and develop new team members.</li>
  <li>Handle conflict, motivation, and performance dips.</li>
</ul>
<h3>📖 Core Lesson</h3>
<p>Digital leadership is influence without a corner office. Your team sees your words, your replies, and your consistency — not your title. Lead like a coach, not a boss.</p>
<p><b>The 4 Habits of a Digital Leader</b></p>
<ul>
  <li><b>Over-communicate:</b> Say it, then say it again. Async teams miss context.</li>
  <li><b>Default to trust:</b> Check the result, not the hours. Micromanagement kills output.</li>
  <li><b>Document everything:</b> If it's in your head, your team can't use it.</li>
  <li><b>Celebrate publicly:</b> Recognise effort every week, not just wins.</li>
</ul>
<p><b>Setting Team KPIs</b> — Pick 3 numbers that matter (e.g., weekly signups, weekly active members, weekly content posts). Review them every Monday. Move the slowest number first.</p>
<p><b>Weekly Team Rhythm</b> — Monday: 15-min standup (wins, blocks, asks). Wednesday: short skill-share. Friday: 1 shoutout + 1 lesson learned.</p>
<p><b>Handling Conflict</b> — Address within 48 hours. Talk to each person privately first. Use facts, not feelings. Agree on a concrete next step.</p>
<div style="border-left:4px solid #fbbf24;padding-left:12px;margin:12px 0;"><b>IMPORTANT:</b> A team takes on the personality of its leader. If you want consistency, be consistent. If you want urgency, be urgent.</div>
<h3>💡 PRO TIP</h3>
<div style="border-left:4px solid #6366f1;padding-left:12px;margin:12px 0;">Record a 2-minute voice note every Monday with your top 3 priorities. It takes 2 minutes and saves the team an hour of guessing.</div>
<h3>🌍 REAL LIFE STORY</h3>
<div style="border-left:4px solid #10b981;padding-left:12px;margin:12px 0;">Rajan, a digital leader in Kathmandu, managed 18 team members across 6 cities. He held a 15-minute Monday call, sent a 3-line Friday recap, and tracked one number: weekly signups. Within 4 months, his team's output tripled — and they hadn't worked a single hour longer.</div>
<h3>✅ Action Steps</h3>
<ol>
  <li>Pick 3 KPIs for your team this week and write them down.</li>
  <li>Schedule a 15-minute Monday standup.</li>
  <li>Send a 3-line Friday recap to your team every week for a month.</li>
</ol>
<h3>📝 Module Summary</h3>
<p>Great digital leaders don't have all the answers — they build the rhythm that finds them. Set clear KPIs, over-communicate, default to trust, and celebrate publicly. Your team will rise to whatever you consistently model.</p>
<h3>❓ Reflection Question</h3>
<p>What's one habit you can start this week that would make your team's life measurably easier?</p>`
    },
    {
      id: 2,
      title: 'Content Creation & Video Marketing',
      content: `<h2>Module 2: Content Creation & Video Marketing</h2>
<h3>🎯 Learning Objectives</h3>
<ul>
  <li>Plan a 30-day content calendar that you can actually execute.</li>
  <li>Record short-form videos with just a phone.</li>
  <li>Edit fast in CapCut and write captions that hook viewers.</li>
  <li>Repurpose one video into 5+ pieces of content.</li>
</ul>
<h3>📖 Core Lesson</h3>
<p>You don't need a camera, a studio, or a course to start posting. You need a phone, a 60-second script, and the discipline to post on schedule. The best camera is the one in your hand.</p>
<p><b>The 30-Day Content Plan</b></p>
<ul>
  <li>Week 1: 7 short videos (60 seconds each). 1 per day.</li>
  <li>Week 2: 7 short videos. Reuse your best hook from Week 1.</li>
  <li>Week 3: 4 long videos + 3 shorts. Try a 5-minute breakdown.</li>
  <li>Week 4: 7 shorts, 1 long. Look at your top 3 — make more like them.</li>
</ul>
<p><b>The 3-Second Hook</b> — Every video must earn the next 3 seconds. Use: "Most people get this wrong…" / "Here's the ₹1,000 mistake I made last month…" / "If you do X, stop."</p>
<p><b>Recording With a Phone</b></p>
<ul>
  <li>Film vertically, eye-level, near a window for natural light.</li>
  <li>Use earphones with a mic — they kill background noise.</li>
  <li>Record 3 takes, pick the most energetic one. Energy beats polish.</li>
</ul>
<p><b>CapCut Basics</b> — Cut every pause. Add captions (it doubles watch time). Add background music at 10% volume. Export at 1080p.</p>
<p><b>Repurpose 1 → 5</b></p>
<ul>
  <li>1 long video → 3 shorts (cut the best 60s clips)</li>
  <li>1 long video → 5 quote images (Canva)</li>
  <li>1 long video → 1 blog post (transcribe + clean up)</li>
</ul>
<div style="border-left:4px solid #fbbf24;padding-left:12px;margin:12px 0;"><b>IMPORTANT:</b> Consistency beats quality. 30 imperfect videos will teach you more than 1 perfect one you never post.</div>
<h3>💡 PRO TIP</h3>
<div style="border-left:4px solid #6366f1;padding-left:12px;margin:12px 0;">Batch-record 5 videos in one session. Same outfit, same background, different scripts. You'll save 3 hours and post all week.</div>
<h3>🌍 REAL LIFE STORY</h3>
<div style="border-left:4px solid #10b981;padding-left:12px;margin:12px 0;">Sita, a college student in Bharatpur, posted one CapCut-edited reel per day for 60 days. Her first 25 videos averaged 80 views. By day 60, one hit 90,000 views and she got two paying clients. She never spent on ads or equipment — just her phone and 30 minutes a day.</div>
<h3>✅ Action Steps</h3>
<ol>
  <li>Write 7 video ideas today. One for each day of next week.</li>
  <li>Record 3 of them this weekend in one batch session.</li>
  <li>Edit and post 1 video every day for 30 days. Track views in a sheet.</li>
</ol>
<h3>📝 Module Summary</h3>
<p>Content creation is a daily habit, not a creative event. Plan 30 days, batch-record with your phone, edit fast in CapCut, and repurpose everything. Consistency is the only shortcut.</p>
<h3>❓ Reflection Question</h3>
<p>What's the smallest content commitment you can do every day for 30 days — and stick to?</p>`
    },
    {
      id: 3,
      title: 'Building a Personal Brand Online',
      content: `<h2>Module 3: Building a Personal Brand Online</h2>
<h3>🎯 Learning Objectives</h3>
<ul>
  <li>Define your niche, voice, and the one problem you solve.</li>
  <li>Build a recognisable visual and verbal identity.</li>
  <li>Use the "pillar post" system to never run out of ideas.</li>
  <li>Turn followers into an audience (and an audience into customers).</li>
</ul>
<h3>📖 Core Lesson</h3>
<p>A personal brand is a <b>promise</b>: when someone sees your name, they should know what to expect. Vague brands get scrolled past. Specific brands get followed, hired, and shared.</p>
<p><b>The Brand Triangle</b></p>
<ul>
  <li><b>Niche:</b> "I help [WHO] do [WHAT] so they can [RESULT]."</li>
  <li><b>Voice:</b> Friendly? Direct? Funny? Authoritative? Pick 1–2 and stick to them.</li>
  <li><b>Look:</b> Same colour, same font, same photo style across all platforms.</li>
</ul>
<p><b>The "I Help" Sentence</b> — Fill in: "I help _____ in _____ achieve _____." Examples: "I help small business owners in Nepal get their first paying customer through Instagram." If you can't fill it in, your brand is too vague.</p>
<p><b>3-5 Content Pillars</b> — Pick 3–5 topics you'll post about forever. Examples: "behind the scenes," "myths I used to believe," "how I did X," "tools I use," "wins from followers." Rotate them so you never run out of ideas.</p>
<p><b>Visual Identity on a Budget</b> — Use Canva: pick 1 brand colour + 1 accent. Use the same font for headlines. Use the same photo filter (or no filter). Apply everywhere.</p>
<p><b>Followers vs. Audience</b> — Followers = vanity. Audience = trust. An audience is a small group of people who open your posts, reply, and buy. Treat them like friends.</p>
<div style="border-left:4px solid #fbbf24;padding-left:12px;margin:12px 0;"><b>IMPORTANT:</b> Be specific. "I help everyone with digital marketing" is not a brand. "I help Pokhara café owners get 30+ Instagram DMs a week" is.</div>
<h3>💡 PRO TIP</h3>
<div style="border-left:4px solid #6366f1;padding-left:12px;margin:12px 0;">Reply to every comment for the first 1,000 followers. The conversation is the brand.</div>
<h3>🌍 REAL LIFE STORY</h3>
<div style="border-left:4px solid #10b981;padding-left:12px;margin:12px 0;">Hari, a teacher in Birgunj, started posting "5-minute Nepali grammar tips" on TikTok. Same hook, same fonts, same background. Within 6 months, 30,000 followers. A coaching client in Dubai paid him Rs. 25,000 for a 4-week course — found him through a single video.</div>
<h3>✅ Action Steps</h3>
<ol>
  <li>Write your "I help" sentence in one line.</li>
  <li>Pick 3 content pillars and 2 brand colours.</li>
  <li>Update your profile photo, bio, and one pinned post to match.</li>
</ol>
<h3>📝 Module Summary</h3>
<p>A personal brand is just a clear promise repeated until people remember it. Define your niche, pick a voice and look, post on 3–5 pillars, and reply to your early audience like friends. Specificity is the entire game.</p>
<h3>❓ Reflection Question</h3>
<p>What would your "I help" sentence sound like if you had to be brutally specific?</p>`
    },
    {
      id: 4,
      title: 'WhatsApp & Social Media Funnels',
      content: `<h2>Module 4: WhatsApp & Social Media Funnels</h2>
<h3>🎯 Learning Objectives</h3>
<ul>
  <li>Build a WhatsApp list you actually own.</li>
  <li>Design a 5-message funnel that converts cold leads to buyers.</li>
  <li>Use broadcast lists, status, and groups without being spammy.</li>
  <li>Connect WhatsApp to a paid offer and measure results.</li>
</ul>
<h3>📖 Core Lesson</h3>
<p>Email is dying in Nepal. WhatsApp is the inbox. If you can run a 5-message WhatsApp funnel, you can run any business. If you can't, you don't have a list — you have a hope.</p>
<p><b>The WhatsApp Funnel Stack</b></p>
<ul>
  <li><b>Top:</b> Facebook / Instagram / TikTok post → CTA: "Comment 'INFO' to get the guide"</li>
  <li><b>Middle:</b> You DM them a free PDF or short video</li>
  <li><b>Bottom:</b> A 5-message sequence that ends with one offer</li>
</ul>
<p><b>Building Your List (the Right Way)</b></p>
<ul>
  <li>Don't add strangers. Earn the opt-in.</li>
  <li>Offer a free PDF, free mini-course, or free audit in exchange for their number.</li>
  <li>Use WhatsApp Broadcast Lists (not Groups) for one-to-many messages — Groups are for conversation, broadcasts are for announcements.</li>
</ul>
<p><b>The 5-Message Nurture Sequence</b></p>
<ol>
  <li><b>Day 0:</b> Deliver the freebie + 1-line intro.</li>
  <li><b>Day 1:</b> Your story — why you do what you do.</li>
  <li><b>Day 3:</b> A specific result from a customer.</li>
  <li><b>Day 5:</b> The offer. Clear price, clear promise, one CTA.</li>
  <li><b>Day 7:</b> "Last call" — bonus or deadline.</li>
</ol>
<p><b>Status Funnel</b> — Post 3–5 WhatsApp Status updates per day: 1 personal, 1 educational, 1 customer win, 1 offer. Status shows your list you're alive without spamming them.</p>
<div style="border-left:4px solid #fbbf24;padding-left:12px;margin:12px 0;"><b>IMPORTANT:</b> Never send the same broadcast 2 days in a row to a cold list. You'll be muted or reported. Earn attention first, then ask for it.</div>
<h3>💡 PRO TIP</h3>
<div style="border-left:4px solid #6366f1;padding-left:12px;margin:12px 0;">Save your 5-message sequence as WhatsApp "Quick Replies" (long-press the message → "Use Quick Reply"). One tap sends the whole sequence to a new lead.</div>
<h3>🌍 REAL LIFE STORY</h3>
<div style="border-left:4px solid #10b981;padding-left:12px;margin:12px 0;">Anish, a freelance designer in Lalitpur, got 200 reactions on his Facebook posts but zero paying clients. He added "Comment GUIDE" → DM PDF → 5-message WhatsApp sequence. Within 3 weeks, 60 leads, 8 sales, Rs. 32,000. Same audience, better funnel.</div>
<h3>✅ Action Steps</h3>
<ol>
  <li>Write your "Comment X to get the freebie" CTA today.</li>
  <li>Create a 1-page PDF that solves one specific problem.</li>
  <li>Write your 5-message sequence in a Google Doc this week.</li>
</ol>
<h3>📝 Module Summary</h3>
<p>WhatsApp is your real inbox in Nepal. Build a list the right way (opt-in only), set up a 5-message sequence (freebie → story → proof → offer → last call), and use Status to stay visible. Run that loop and you have a business.</p>
<h3>❓ Reflection Question</h3>
<p>What's the one freebie you could create in a weekend that would make strangers happily give you their WhatsApp number?</p>`
    },
    {
      id: 5,
      title: 'Financial Planning for Online Earners',
      content: `<h2>Module 5: Financial Planning for Online Earners</h2>
<h3>🎯 Learning Objectives</h3>
<ul>
  <li>Separate personal, business, and tax money — even on a small income.</li>
  <li>Build a simple monthly budget that fits irregular online income.</li>
  <li>Save, invest, and protect your earnings as a freelancer in Nepal.</li>
  <li>Plan for taxes, eSewa/Khalti records, and PAN registration.</li>
</ul>
<h3>📖 Core Lesson</h3>
<p>Earning online is exciting. Keeping the money is harder. Most freelancers in Nepal leak 20–40% of their income to avoidable mistakes: mixing personal and business money, no emergency fund, and no tax plan. Fix that, and you instantly out-earn 90% of peers.</p>
<p><b>The 3-Bucket System</b></p>
<ul>
  <li><b>Personal (60%):</b> Rent, food, transport, family. Move on the 1st of the month.</li>
  <li><b>Tax & Buffer (25%):</b> Park in a separate eSewa or savings account. Don't touch.</li>
  <li><b>Reinvest (15%):</b> Courses, tools, ads, equipment. Your future income's fuel.</li>
</ul>
<p><b>Budgeting on Irregular Income</b></p>
<ul>
  <li>Calculate your lowest month in the last 6. That's your "floor."</li>
  <li>Build a 3-month floor emergency fund. Don't touch it.</li>
  <li>Live on last month's income, not this month's deposit. Always.</li>
</ul>
<p><b>Tracking Tools</b> — Use a Google Sheet with 3 columns: Date, Source, Amount. Total weekly. Takes 5 minutes. Do it.</p>
<p><b>Tax Basics (Nepal)</b></p>
<ul>
  <li>If you earn over Rs. 5 lakh/year from freelancing, register for PAN.</li>
  <li>Keep records of all income + business expenses. Save eSewa/Khalti statements monthly.</li>
  <li>Consult a CA before year-end — Rs. 2,000 saved you from Rs. 50,000 in fines.</li>
</ul>
<p><b>Reinvestment Ideas</b> — Courses, a better laptop, a paid tool, Facebook ads, a small website. Reinvest 15% minimum.</p>
<div style="border-left:4px solid #fbbf24;padding-left:12px;margin:12px 0;"><b>IMPORTANT:</b> Money you don't see, you don't spend. Auto-transfer 25% to a separate account the moment you're paid.</div>
<h3>💡 PRO TIP</h3>
<div style="border-left:4px solid #6366f1;padding-left:12px;margin:12px 0;">Open a second eSewa account just for tax. Name it "TAX — DO NOT TOUCH." When year-end comes, you'll thank past you.</div>
<h3>🌍 REAL LIFE STORY</h3>
<div style="border-left:4px solid #10b981;padding-left:12px;margin:12px 0;">Sujata, a content creator in Pokhara, used to spend every rupee the day it came in. She switched to the 3-bucket system, automated the 25% tax transfer, and stopped mixing business + personal money. In one year, she saved Rs. 4.5 lakh — the first time in her life she had an emergency fund.</div>
<h3>✅ Action Steps</h3>
<ol>
  <li>Open a separate eSewa or bank account for tax + buffer this week.</li>
  <li>Move your last 3 months of income through the 3-bucket split in a sheet.</li>
  <li>Build a 3-month emergency fund goal and set a weekly auto-transfer.</li>
</ol>
<h3>📝 Module Summary</h3>
<p>Online income is volatile — plan for the lowest month, not the best. Use the 3-bucket system, separate business and personal money, save 25% for tax, and reinvest 15% in your future. A CA visit once a year pays for itself 10x.</p>
<h3>❓ Reflection Question</h3>
<p>What would change in your life if 25% of every payment was invisible to you the moment it arrived?</p>`
    },
    {
      id: 6,
      title: 'Online Safety & Scam Awareness',
      content: `<h2>Module 6: Online Safety & Scam Awareness</h2>
<h3>🎯 Learning Objectives</h3>
<ul>
  <li>Spot the 7 most common online scams targeting Nepali freelancers.</li>
  <li>Protect your accounts, money, and identity with basic digital hygiene.</li>
  <li>Verify clients, platforms, and payment proofs before sending anything.</li>
  <li>Recover fast if you've been scammed.</li>
</ul>
<h3>📖 Core Lesson</h3>
<p>If it sounds too good to be true, it is. Every successful Nepali freelancer has a scam story — the question isn't "will I get scammed?" it's "when, and how prepared am I?"</p>
<p><b>The 7 Most Common Scams</b></p>
<ul>
  <li><b>"Send first, I'll pay later":</b> Client wants work before payment. Walk away.</li>
  <li><b>Fake payment screenshots:</b> A "we paid" image is not a payment. Always check your eSewa/Khalti first.</li>
  <li><b>"Pay to upgrade your account":</b> Real platforms never ask for money to release your earnings.</li>
  <li><b>Phishing links:</b> "Your account is suspended, click here." Always go to the site directly.</li>
  <li><b>Overpayment scams:</b> "I sent Rs. 10,000 by mistake, refund Rs. 7,000." The original payment is reversed; you lose Rs. 7,000.</li>
  <li><b>Investment / task scams:</b> "Earn Rs. 5,000/day liking videos." It's a money-laundering trap.</li>
  <li><b>Fake job offers:</b> "You're hired, send Rs. 2,000 for training materials." Real employers don't charge employees.</li>
</ul>
<p><b>Digital Hygiene Basics</b></p>
<ul>
  <li>Use a unique password for every site. Use a password manager (Bitwarden is free).</li>
  <li>Turn on 2-factor authentication (2FA) for email, eSewa, Khalti, Facebook, Instagram.</li>
  <li>Never share OTPs, even with "support agents." Real support never asks.</li>
  <li>Verify URLs — facebook.com ≠ facebo0k-login.com.</li>
  <li>Lock your phone with a PIN or fingerprint.</li>
</ul>
<p><b>Verifying Clients</b></p>
<ul>
  <li>Ask for a video call before any big project.</li>
  <li>Check the client's LinkedIn and company website.</li>
  <li>Get 30–50% advance for new clients. Full upfront for tiny jobs.</li>
  <li>Use milestones on Upwork/Fiverr, not direct bank transfers for strangers.</li>
</ul>
<p><b>Verifying Payments (Nepal)</b></p>
<ul>
  <li>Open eSewa / Khalti / banking app. Read the actual notification. Don't trust screenshots.</li>
  <li>Wait for the "Amount credited" SMS, not just a "request sent" or "pending" status.</li>
  <li>For eSewa: the sender's name and amount must match.</li>
</ul>
<p><b>If You Get Scammed</b></p>
<ol>
  <li>Stop sending more money or work immediately.</li>
  <li>Screenshot everything — chats, payment proofs, profiles.</li>
  <li>Report to the platform and your bank/eSewa.</li>
  <li>File a complaint at Nepal Police Cyber Bureau (cyberbureau.nepalpolice.gov.np).</li>
  <li>Post a public warning so others don't fall for it.</li>
</ol>
<div style="border-left:4px solid #fbbf24;padding-left:12px;margin:12px 0;"><b>IMPORTANT:</b> Never trust, always verify. If anyone — client, "support," "investor" — pressures you to act in 24 hours, that's a red flag, not urgency.</div>
<h3>💡 PRO TIP</h3>
<div style="border-left:4px solid #6366f1;padding-left:12px;margin:12px 0;">Search "[platform name] + scam" on Facebook before joining any new earning site. Real users post warnings within weeks of a scam appearing.</div>
<h3>🌍 REAL LIFE STORY</h3>
<div style="border-left:4px solid #10b981;padding-left:12px;margin:12px 0;">Krishna, a freelance video editor in Butwal, was offered Rs. 15,000 for a simple editing job. The "client" sent a fake payment screenshot and asked Krishna to refund Rs. 8,000 as "overpayment." Krishna almost did. His friend caught the scam in time. He now waits 24 hours and verifies every payment in his eSewa app before delivering work.</div>
<h3>✅ Action Steps</h3>
<ol>
  <li>Install a password manager (Bitwarden) and set unique passwords for eSewa + email.</li>
  <li>Turn on 2FA for eSewa, Khalti, email, and Facebook today.</li>
  <li>Save Nepal Police Cyber Bureau's number and website to your phone.</li>
</ol>
<h3>📝 Module Summary</h3>
<p>Scams target the hopeful and the rushed. Learn the 7 common patterns, use unique passwords + 2FA, verify every payment in your real banking app, and never send work or money before verification. If you're ever pressured to act in 24 hours, walk away — that's not a deal, that's a trap.</p>
<h3>❓ Reflection Question</h3>
<p>What's one "too good to be true" offer you've seen recently that, after this module, you'll now walk away from?</p>`
    }
  ],

  everything: [
    {
      id: 1,
      title: 'The Digital Mindset',
      content: `<h2>Module 1: The Digital Mindset</h2>
<h3>🎯 Learning Objectives</h3>
<ul>
  <li>Understand what a digital mindset is and why it matters.</li>
  <li>Embrace lifelong learning and adaptability.</li>
  <li>Overcome fear of technology and failure.</li>
  <li>Develop a growth mindset for digital success.</li>
</ul>
<h3>📖 Core Lesson</h3>
<p>A digital mindset means being open to new ideas, tools, and ways of working. It's about curiosity, flexibility, and seeing technology as an opportunity, not a threat.</p>
<p><b>Embracing Lifelong Learning</b></p>
<ul>
  <li>Set aside time each week to learn something new online.</li>
  <li>Follow industry leaders on YouTube, LinkedIn, or local groups.</li>
  <li>Take free courses or attend webinars regularly.</li>
</ul>
<p><b>Overcoming Fear of Technology</b></p>
<ul>
  <li>Start small—try one new app or tool at a time.</li>
  <li>Ask for help from friends, family, or online communities.</li>
  <li>Remember: Everyone was a beginner once!</li>
</ul>
<p><b>Developing a Growth Mindset</b> — Believe that skills can be learned and improved. Celebrate progress, not just perfection.</p>
<div style="border-left:4px solid #fbbf24;padding-left:12px;margin:12px 0;"><b>IMPORTANT:</b> Curiosity is more important than credentials in the digital world. The willingness to learn beats knowing the "right" answer.</div>
<h3>💡 PRO TIP</h3>
<div style="border-left:4px solid #6366f1;padding-left:12px;margin:12px 0;">Join a local or online study group to stay motivated and accountable.</div>
<h3>🌍 REAL LIFE STORY</h3>
<div style="border-left:4px solid #10b981;padding-left:12px;margin:12px 0;">Sunita, a homemaker in Nepalgunj, was afraid of using computers. She started with YouTube tutorials, joined a Facebook group for digital learners, and now teaches others in her community.</div>
<h3>✅ Action Steps</h3>
<ol>
  <li>Pick one new digital tool or app to try this week.</li>
  <li>Share a recent learning or failure with a friend or group.</li>
  <li>Set a weekly learning goal and track your progress.</li>
</ol>
<h3>📝 Module Summary</h3>
<p>A digital mindset is about curiosity, resilience, and growth. By embracing change and learning from mistakes, you set yourself up for long-term success.</p>
<h3>❓ Reflection Question</h3>
<p>What's one digital skill you want to learn this month, and what's your first step?</p>`
    },
    {
      id: 2,
      title: 'Building Multiple Income Streams',
      content: `<h2>Module 2: Building Multiple Income Streams</h2>
<h3>🎯 Learning Objectives</h3>
<ul>
  <li>Understand the importance of income diversification.</li>
  <li>Explore different digital income streams.</li>
  <li>Learn how to start and manage multiple streams.</li>
  <li>Balance time and energy across projects.</li>
</ul>
<h3>📖 Core Lesson</h3>
<p><b>Why Diversify?</b> Relying on one income source is risky—platforms change, trends shift. Diversification provides stability and more opportunities.</p>
<p><b>Types of Digital Income Streams</b></p>
<ul>
  <li>Freelancing (writing, design, coding, etc.)</li>
  <li>Affiliate marketing</li>
  <li>Digital products (e-books, courses, templates)</li>
  <li>Online teaching or tutoring</li>
  <li>Content creation (YouTube, TikTok, Instagram)</li>
  <li>Remote jobs (customer support, virtual assistant)</li>
</ul>
<p><b>How to Start a New Stream</b></p>
<ul>
  <li>Research: What skills or interests do you have?</li>
  <li>Start small—test one new stream before adding more.</li>
  <li>Leverage your existing network for your first clients or customers.</li>
</ul>
<p><b>Managing Multiple Streams</b> — Use a planner or digital tool to track tasks and deadlines. Set boundaries to avoid burnout. Review your progress monthly and adjust as needed.</p>
<div style="border-left:4px solid #fbbf24;padding-left:12px;margin:12px 0;"><b>IMPORTANT:</b> Multiple income streams only work if each one is at least 80% automated or delegated. Otherwise you just have multiple jobs, not multiple streams.</div>
<h3>💡 PRO TIP</h3>
<div style="border-left:4px solid #6366f1;padding-left:12px;margin:12px 0;">Start with one new income stream, master it, then add another. Don't try to do everything at once.</div>
<h3>🌍 REAL LIFE STORY</h3>
<div style="border-left:4px solid #10b981;padding-left:12px;margin:12px 0;">Sita, a college student in Dharan, began with referral marketing. She then started freelance writing and later launched a digital course. Now, she earns from three sources and feels more secure.</div>
<h3>✅ Action Steps</h3>
<ol>
  <li>List your current and potential income streams.</li>
  <li>Pick one new stream to research and start this month.</li>
  <li>Set a monthly review to track your progress and adjust.</li>
</ol>
<h3>📝 Module Summary</h3>
<p>Building multiple income streams increases your stability and growth. Start small, stay organized, and keep learning as you diversify.</p>
<h3>❓ Reflection Question</h3>
<p>Which digital income stream excites you most, and what's your first step to start?</p>`
    },
    {
      id: 3,
      title: 'Networking & Collaboration',
      content: `<h2>Module 3: Networking & Collaboration</h2>
<h3>🎯 Learning Objectives</h3>
<ul>
  <li>Understand the value of networking in the digital world.</li>
  <li>Learn how to build and nurture professional relationships online.</li>
  <li>Explore collaboration opportunities for growth.</li>
  <li>Leverage communities for support and learning.</li>
</ul>
<h3>📖 Core Lesson</h3>
<p>Your network is your net worth—opportunities often come from connections. Online communities break geographic barriers.</p>
<p><b>Building Professional Relationships Online</b></p>
<ul>
  <li>Be genuine—offer help before asking for it.</li>
  <li>Engage in group discussions, comment on posts, and share resources.</li>
  <li>Follow up with new contacts and stay in touch.</li>
</ul>
<p><b>Collaboration Opportunities</b></p>
<ul>
  <li>Co-create content (podcasts, webinars, articles).</li>
  <li>Partner on projects or events.</li>
  <li>Refer clients or share job leads.</li>
</ul>
<p><b>Leveraging Communities</b> — Join groups related to your field or interests (Facebook, LinkedIn, WhatsApp). Attend virtual events, webinars, or workshops. Ask questions and share your experiences.</p>
<div style="border-left:4px solid #fbbf24;padding-left:12px;margin:12px 0;"><b>IMPORTANT:</b> Give first. The people who help others without expecting anything in return get the best opportunities in the long run.</div>
<h3>💡 PRO TIP</h3>
<div style="border-left:4px solid #6366f1;padding-left:12px;margin:12px 0;">Set a goal to connect with one new person in your field every week.</div>
<h3>🌍 REAL LIFE STORY</h3>
<div style="border-left:4px solid #10b981;padding-left:12px;margin:12px 0;">Prakash, a freelancer in Butwal, joined a digital marketing group on Facebook. He collaborated on a webinar with another member, which led to new clients and friendships.</div>
<h3>✅ Action Steps</h3>
<ol>
  <li>Join one new online community this week and introduce yourself.</li>
  <li>Reach out to someone you admire and start a conversation.</li>
  <li>Offer help or feedback to a peer in your network.</li>
</ol>
<h3>📝 Module Summary</h3>
<p>Networking and collaboration open doors to new opportunities and learning. Be proactive, genuine, and supportive in your digital relationships.</p>
<h3>❓ Reflection Question</h3>
<p>Who is one person you'd like to connect or collaborate with this month, and how will you reach out?</p>`
    },
    {
      id: 4,
      title: 'Giving Back & Mentoring',
      content: `<h2>Module 4: Giving Back & Mentoring</h2>
<h3>🎯 Learning Objectives</h3>
<ul>
  <li>Understand the value of giving back in digital communities.</li>
  <li>Learn how to mentor and support newcomers.</li>
  <li>Explore ways to create helpful content and resources.</li>
  <li>Build a legacy through service and teaching.</li>
</ul>
<h3>📖 Core Lesson</h3>
<p>Helping others strengthens your own skills and reputation. Communities grow stronger when members support each other.</p>
<p><b>How to Mentor Newcomers</b></p>
<ul>
  <li>Share your story and lessons learned.</li>
  <li>Offer guidance through messages, calls, or group chats.</li>
  <li>Encourage questions and celebrate progress.</li>
</ul>
<p><b>Creating Helpful Content</b> — Write guides, record videos, or host Q&A sessions. Share resources and answer common questions.</p>
<p><b>Building a Legacy</b> — Mentor others to continue your work and values. Organize free workshops or online events.</p>
<p><b>Balancing Giving and Earning</b> — Set boundaries to avoid burnout. Remember: Giving back is an investment in your community and yourself.</p>
<div style="border-left:4px solid #fbbf24;padding-left:12px;margin:12px 0;"><b>IMPORTANT:</b> You can give back even when you don't feel like an expert. Two steps ahead is enough to help someone who's just starting.</div>
<h3>💡 PRO TIP</h3>
<div style="border-left:4px solid #6366f1;padding-left:12px;margin:12px 0;">Host a free Q&A session or write a beginner's guide to help newcomers in your field.</div>
<h3>🌍 REAL LIFE STORY</h3>
<div style="border-left:4px solid #10b981;padding-left:12px;margin:12px 0;">Amit, a digital mentor in Chitwan, started a weekly online Q&A for beginners. His sessions became popular, and many of his mentees now mentor others, creating a ripple effect.</div>
<h3>✅ Action Steps</h3>
<ol>
  <li>Share one helpful resource or tip in a group this week.</li>
  <li>Offer to mentor a newcomer or answer their questions.</li>
  <li>Plan a small online event or Q&A session for your community.</li>
</ol>
<h3>📝 Module Summary</h3>
<p>Giving back and mentoring build stronger communities and lasting impact. By sharing your knowledge and supporting others, you create a legacy of growth and service.</p>
<h3>❓ Reflection Question</h3>
<p>What's one way you can give back to your digital community this month?</p>`
    },
    {
      id: 5,
      title: 'Designing Your Digital Future',
      content: `<h2>Module 5: Designing Your Digital Future</h2>
<h3>🎯 Learning Objectives</h3>
<ul>
  <li>Set short-term and long-term digital career goals.</li>
  <li>Track progress and celebrate milestones.</li>
  <li>Adapt to changes and stay motivated.</li>
  <li>Own your unique digital journey.</li>
</ul>
<h3>📖 Core Lesson</h3>
<p><b>Setting Digital Career Goals</b> — Write down your 1-year, 3-year, and 5-year goals. Break big goals into smaller, actionable steps.</p>
<p><b>Tracking Progress</b> — Use a journal, spreadsheet, or app to monitor your achievements. Review your progress monthly and adjust as needed.</p>
<p><b>Celebrating Milestones</b> — Reward yourself for reaching goals, big or small. Share your wins with your community for encouragement.</p>
<p><b>Adapting to Change</b> — Stay flexible—digital trends and platforms evolve quickly. Be willing to learn new skills and pivot when needed.</p>
<p><b>Owning Your Unique Journey</b> — Everyone's path is different—don't compare your progress to others. Focus on your strengths and passions.</p>
<div style="border-left:4px solid #fbbf24;padding-left:12px;margin:12px 0;"><b>IMPORTANT:</b> The future belongs to people who can adapt, not just accumulate. Build optionality.</div>
<h3>💡 PRO TIP</h3>
<div style="border-left:4px solid #6366f1;padding-left:12px;margin:12px 0;">Set a recurring reminder to review your goals and progress every month.</div>
<h3>🌍 REAL LIFE STORY</h3>
<div style="border-left:4px solid #10b981;padding-left:12px;margin:12px 0;">Rina, a digital worker in Janakpur, set clear goals for her online business. She tracked her progress, celebrated each milestone, and adapted her strategy as trends changed. Her journey inspired others in her community to start their own digital careers.</div>
<h3>✅ Action Steps</h3>
<ol>
  <li>Write down your digital career goals for the next 1, 3, and 5 years.</li>
  <li>Choose a method to track your progress and set a review date.</li>
  <li>Celebrate a recent milestone and share your story with others.</li>
</ol>
<h3>📝 Module Summary</h3>
<p>Designing your digital future is about goals, tracking progress, and staying adaptable. Celebrate your journey and inspire others along the way.</p>
<h3>❓ Reflection Question</h3>
<p>What's your biggest digital goal for the next year, and what's your first step to achieve it?</p>`
    },
    {
      id: 6,
      title: 'Bundling Your Skills for Maximum Impact',
      content: `<h2>Module 6: Bundling Your Skills for Maximum Impact</h2>
<h3>🎯 Learning Objectives</h3>
<ul>
  <li>See how Starter + Prime + Master fit together as one system.</li>
  <li>Pick your next 90-day focus across all three courses.</li>
  <li>Build a personal "complete path" with milestones and a finish line.</li>
  <li>Use this bundle as a long-term reference, not a one-time read.</li>
</ul>
<h3>📖 Core Lesson</h3>
<p>You bought the <b>Everything Bundle</b> for a reason — to stop bouncing between random tutorials and follow one clear path from beginner to leader. This module ties the whole system together so the next 90 days have a shape.</p>
<p><b>How the Three Courses Connect</b></p>
<ul>
  <li><b>Starter (Foundations):</b> Personal brand, communication, mindset, online earning basics, your first project.</li>
  <li><b>Prime (Growth):</b> Advanced referrals, audience targeting, free tools, tracking, community, funnels.</li>
  <li><b>Master (Leadership):</b> Team management, content creation, brand building, WhatsApp funnels, financial planning, online safety.</li>
</ul>
<p><b>The 90-Day Plan</b></p>
<ul>
  <li><b>Days 1–30 (Starter):</b> Finish modules 1–6. Apply 1 action step per module. Ship your first small project by day 30.</li>
  <li><b>Days 31–60 (Prime):</b> Finish modules 1–6. Build your tracking sheet, your WhatsApp list, your first funnel. Land 1 paying client or sale by day 60.</li>
  <li><b>Days 61–90 (Master):</b> Finish modules 1–6. Set up your 3-bucket finance system, 2FA everywhere, and your first piece of long-form content. Hit Rs. 5,000 in earnings by day 90.</li>
</ul>
<p><b>Milestones Worth Tracking</b></p>
<ul>
  <li>Day 30: First public project shipped</li>
  <li>Day 60: First paying client or sale</li>
  <li>Day 90: Rs. 5,000 in earnings + 100-message WhatsApp list</li>
  <li>Day 180: Rs. 25,000 in earnings + reusable 5-message funnel</li>
</ul>
<p><b>Use This Bundle as a Library</b> — You don't need to finish every module perfectly. Use the search bar in your head: "Where did the course talk about pricing?" → Re-read Master Module 5. Treat this as a reference, not a checklist.</p>
<div style="border-left:4px solid #fbbf24;padding-left:12px;margin:12px 0;"><b>IMPORTANT:</b> Knowledge without action is entertainment. Pick one module per week. Apply it for 7 days. Move on. Action × time = results.</div>
<h3>💡 PRO TIP</h3>
<div style="border-left:4px solid #6366f1;padding-left:12px;margin:12px 0;">Set a recurring 30-minute Sunday "review + plan" — review what you applied this week, pick 3 actions for next week. Done for 12 weeks, you'll out-earn 95% of people who bought courses and did nothing.</div>
<h3>🌍 REAL LIFE STORY</h3>
<div style="border-left:4px solid #10b981;padding-left:12px;margin:12px 0;">Manish from Hetauda bought the Everything Bundle, picked the 90-day plan, and stuck to it. He finished Starter in 28 days, Prime in 32 days, Master in 30 days. By day 90, he had a WhatsApp list of 200, a 5-message funnel, and Rs. 7,500 in earnings. By month 6, he was earning Rs. 35,000/month from his side hustle — all from one bundle, applied.</div>
<h3>✅ Action Steps</h3>
<ol>
  <li>Print or screenshot the 90-day plan above. Stick it on your wall.</li>
  <li>Pick this week's 3 action steps (1 from each course) and write them in a Google Doc.</li>
  <li>Block 30 minutes every Sunday for review + planning. Add to your calendar now.</li>
</ol>
<h3>📝 Module Summary</h3>
<p>The Everything Bundle is a system, not a stack of PDFs. Starter gets you started. Prime gets you growing. Master gets you leading. Apply 1 action per module, follow the 90-day plan, and run a 30-minute Sunday review. Six months from now, you'll be the person others ask "how did you do it?"</p>
<h3>❓ Reflection Question</h3>
<p>What does your life look like 90 days from now if you actually apply one action step from every module you read?</p>`
    }
  ]
};

function getModules(courseKey) {
  return courseContent[courseKey] || [];
}

function getModuleCount(courseKey) {
  return (courseContent[courseKey] || []).length;
}

module.exports = { courseContent, getModules, getModuleCount };
