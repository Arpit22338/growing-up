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
    }
  ],

  master: [
    {
      id: 1,
      title: 'Leadership in Digital Networks',
      content: `<h2>Module 1: Leadership in Digital Networks</h2>
<h3>🎯 Learning Objectives</h3>
<ul>
  <li>Understand the difference between leading online and offline.</li>
  <li>Learn the principles of servant leadership in digital communities.</li>
  <li>Build credibility, authority, and mentorship structures.</li>
  <li>Handle team conflicts and inspire consistency.</li>
</ul>
<h3>📖 Core Lesson</h3>
<p>Leadership in digital spaces is about influence, not just authority. Unlike traditional leadership, you may never meet your team in person. Your words, actions, and digital presence set the tone.</p>
<p><b>Servant Leadership in Digital Communities</b></p>
<ul>
  <li>Put your team's needs first.</li>
  <li>Listen actively and respond to feedback.</li>
  <li>Share credit for successes and take responsibility for failures.</li>
</ul>
<p><b>Building Credibility and Authority</b></p>
<ul>
  <li>Be consistent in your communication and actions.</li>
  <li>Share your own learning journey and results.</li>
  <li>Support others publicly and privately.</li>
</ul>
<p><b>Setting Team KPIs</b> — Define clear, measurable goals (e.g., number of referrals, engagement rate). Review progress together and celebrate wins.</p>
<p><b>Handling Team Conflicts and Drama</b> — Address issues quickly and fairly. Listen to all sides before making decisions. Keep discussions respectful and focused on solutions.</p>
<div style="border-left:4px solid #fbbf24;padding-left:12px;margin:12px 0;"><b>IMPORTANT:</b> The team takes on the personality of the leader. If you want them to be honest, supportive, and consistent, you have to be that first.</div>
<h3>💡 PRO TIP</h3>
<div style="border-left:4px solid #6366f1;padding-left:12px;margin:12px 0;">Record short video messages for your team. Seeing your face and hearing your voice builds trust and connection.</div>
<h3>🌍 REAL LIFE STORY</h3>
<div style="border-left:4px solid #10b981;padding-left:12px;margin:12px 0;">Rajan, a digital leader in Kathmandu, managed a team of 20 across Nepal. He held weekly Zoom calls, shared his own progress, and encouraged open discussion. When a conflict arose between two members, he listened to both sides and helped them find common ground. His team became more engaged, and their results improved.</div>
<h3>✅ Action Steps</h3>
<ol>
  <li>Schedule a weekly team call or check-in.</li>
  <li>Share your own learning journey with your team this week.</li>
  <li>Address any unresolved team issues within 48 hours.</li>
</ol>
<h3>📝 Module Summary</h3>
<p>Digital leadership is about service, consistency, and adaptability. By putting your team first, modeling positive behavior, and addressing challenges quickly, you build a strong, motivated network.</p>
<h3>❓ Reflection Question</h3>
<p>How can you better serve and inspire your digital team this month?</p>`
    },
    {
      id: 2,
      title: 'Scaling Your Earnings',
      content: `<h2>Module 2: Scaling Your Earnings</h2>
<h3>🎯 Learning Objectives</h3>
<ul>
  <li>Understand the difference between linear and leveraged income.</li>
  <li>Learn how to build systems and delegate tasks.</li>
  <li>Master content repurposing and automation.</li>
  <li>Explore passive income and income diversification.</li>
</ul>
<h3>📖 Core Lesson</h3>
<p><b>Linear vs. Leveraged Income</b> — Linear: you earn only for the work you do. Leveraged: you earn from systems, teams, or content that works for you (e.g., team referrals, evergreen videos).</p>
<p><b>Building Systems</b></p>
<ul>
  <li>Document your processes (how you onboard, follow up, train).</li>
  <li>Use tools (Trello, Notion) to track tasks and progress.</li>
  <li>Delegate routine tasks to team members or virtual assistants.</li>
</ul>
<p><b>Content Repurposing</b> — Turn one video into a blog post, Instagram story, and WhatsApp broadcast. Schedule content in advance using tools like Buffer or Facebook Creator Studio.</p>
<p><b>Automating Follow-Ups</b> — Use WhatsApp broadcast lists or email sequences. Set reminders for follow-ups in Google Calendar.</p>
<p><b>Creating Passive Income Streams</b> — Build a YouTube channel with evergreen content. Create digital products (e-books, templates). Set up affiliate links in your content.</p>
<div style="border-left:4px solid #fbbf24;padding-left:12px;margin:12px 0;"><b>IMPORTANT:</b> Don't trade time for money forever. The goal of scaling is to free up your hours while your income grows.</div>
<h3>💡 PRO TIP</h3>
<div style="border-left:4px solid #6366f1;padding-left:12px;margin:12px 0;">Batch your content creation—record or write several pieces at once, then schedule them over the week.</div>
<h3>🌍 REAL LIFE STORY</h3>
<div style="border-left:4px solid #10b981;padding-left:12px;margin:12px 0;">Sujata, a digital entrepreneur in Pokhara, started by doing everything herself. She documented her processes, hired a VA for admin work, and focused on creating evergreen YouTube videos. Within six months, her income doubled, and she had more free time.</div>
<h3>✅ Action Steps</h3>
<ol>
  <li>Document one process you repeat often and delegate it this week.</li>
  <li>Repurpose one piece of content into two new formats.</li>
  <li>Research one new passive income stream to start this month.</li>
</ol>
<h3>📝 Module Summary</h3>
<p>Scaling your earnings means building systems, delegating, and creating content that works for you. By leveraging your time and diversifying income, you build a more sustainable digital career.</p>
<h3>❓ Reflection Question</h3>
<p>What's one task you could automate or delegate to free up your time for higher-value work?</p>`
    },
    {
      id: 3,
      title: 'Handling Challenges & Rejections',
      content: `<h2>Module 3: Handling Challenges & Rejections</h2>
<h3>🎯 Learning Objectives</h3>
<ul>
  <li>Understand the neuroscience of rejection and how to reframe failure.</li>
  <li>Build emotional resilience and handle objections.</li>
  <li>Learn to get honest feedback and deal with negativity.</li>
  <li>Prevent burnout and bounce back from setbacks.</li>
</ul>
<h3>📖 Core Lesson</h3>
<p><b>The Neuroscience of Rejection</b> — Rejection activates the same brain regions as physical pain. That's why it hurts! But it's also a sign you're taking action and growing.</p>
<p><b>Reframing Failure as Data</b> — Every "no" is feedback, not a personal attack. Ask: What can I learn? How can I improve?</p>
<p><b>5-Stage Objection Handling Framework</b></p>
<ol>
  <li>Listen fully.</li>
  <li>Empathize: "I understand how you feel."</li>
  <li>Clarify: "Can you tell me more about your concern?"</li>
  <li>Respond with facts or stories.</li>
  <li>Ask for a small next step.</li>
</ol>
<p><b>Burnout Prevention</b> — Set boundaries: work hours, screen time. Take regular breaks and celebrate small wins.</p>
<div style="border-left:4px solid #fbbf24;padding-left:12px;margin:12px 0;"><b>IMPORTANT:</b> Rejection is data, not identity. The fastest growers are the ones who hear "no" the most and never stop showing up.</div>
<h3>💡 PRO TIP</h3>
<div style="border-left:4px solid #6366f1;padding-left:12px;margin:12px 0;">Keep a "rejection journal" to track what happened, how you felt, and what you learned. Review it monthly to see your growth.</div>
<h3>🌍 REAL LIFE STORY</h3>
<div style="border-left:4px solid #10b981;padding-left:12px;margin:12px 0;">Manish, a digital worker in Biratnagar, faced 20 rejections in his first month. He started asking for feedback, improved his pitch, and took breaks when feeling low. By month three, his acceptance rate doubled, and he felt more confident.</div>
<h3>✅ Action Steps</h3>
<ol>
  <li>Write down your last rejection and what you learned from it.</li>
  <li>Ask for feedback from someone who said no this week.</li>
  <li>Set a daily self-care habit to build resilience.</li>
</ol>
<h3>📝 Module Summary</h3>
<p>Rejection is part of the digital journey. By reframing failure, seeking feedback, and caring for yourself, you turn setbacks into stepping stones for success.</p>
<h3>❓ Reflection Question</h3>
<p>How can you use your next rejection as a tool for growth?</p>`
    },
    {
      id: 4,
      title: 'Advanced Team Management',
      content: `<h2>Module 4: Advanced Team Management</h2>
<h3>🎯 Learning Objectives</h3>
<ul>
  <li>Learn the difference between delegation and micromanagement.</li>
  <li>Run effective online meetings and use project management tools.</li>
  <li>Track team performance and create SOPs.</li>
  <li>Handle underperformers and plan for succession.</li>
</ul>
<h3>📖 Core Lesson</h3>
<p><b>Delegation vs. Micromanagement</b> — Delegation is trusting team members to complete tasks with guidance. Micromanagement controls every detail, which reduces motivation.</p>
<p><b>Running Effective Online Meetings</b></p>
<ul>
  <li>Set an agenda and share it in advance.</li>
  <li>Time-box each topic to stay on track.</li>
  <li>Assign action items and follow up.</li>
</ul>
<p><b>Using Trello or Notion for Team Project Management</b> — Create boards for each project. Assign tasks, set deadlines, and track progress. Share updates in group chats.</p>
<p><b>Creating SOPs (Standard Operating Procedures)</b> — Document step-by-step guides for common tasks. Make SOPs accessible to all team members.</p>
<p><b>Handling Underperformers Compassionately</b> — Check in privately to understand challenges. Offer support and resources. Set clear expectations for improvement.</p>
<div style="border-left:4px solid #fbbf24;padding-left:12px;margin:12px 0;"><b>IMPORTANT:</b> Don't promote someone just because they're loyal. Promote based on skill AND leadership ability.</div>
<h3>💡 PRO TIP</h3>
<div style="border-left:4px solid #6366f1;padding-left:12px;margin:12px 0;">Record your screen while doing a task and share the video as an SOP for your team.</div>
<h3>🌍 REAL LIFE STORY</h3>
<div style="border-left:4px solid #10b981;padding-left:12px;margin:12px 0;">Sabina, a team leader in Lalitpur, struggled with team motivation. She started delegating tasks, created SOPs, and held short, focused meetings. She recognized top performers and supported those struggling. Her team became more productive and happier.</div>
<h3>✅ Action Steps</h3>
<ol>
  <li>Delegate one task you usually do yourself this week.</li>
  <li>Create a simple SOP (written or video) for a common process.</li>
  <li>Recognize a team member's achievement publicly.</li>
</ol>
<h3>📝 Module Summary</h3>
<p>Advanced team management is about trust, clear communication, and support. By delegating, documenting, and recognizing effort, you build a high-performing, motivated team.</p>
<h3>❓ Reflection Question</h3>
<p>What's one process you can document or delegate to help your team grow?</p>`
    },
    {
      id: 5,
      title: 'Long-Term Success Strategies',
      content: `<h2>Module 5: Long-Term Success Strategies</h2>
<h3>🎯 Learning Objectives</h3>
<ul>
  <li>Create a 1-year, 3-year, and 5-year digital career roadmap.</li>
  <li>Build a personal brand that outlasts any platform.</li>
  <li>Diversify platforms and stay updated with trends.</li>
  <li>Mentor others and define personal success.</li>
</ul>
<h3>📖 Core Lesson</h3>
<p><b>The Digital Career Roadmap</b></p>
<ul>
  <li><b>1-year:</b> Master your current platform, build a strong network.</li>
  <li><b>3-year:</b> Expand to new platforms, create digital products, lead a team.</li>
  <li><b>5-year:</b> Become a recognized expert, mentor others, diversify income streams.</li>
</ul>
<p><b>Building a Personal Brand That Lasts</b></p>
<ul>
  <li>Focus on values, not just skills.</li>
  <li>Share your story and lessons learned.</li>
  <li>Be consistent across platforms.</li>
</ul>
<p><b>Diversifying Platforms</b> — Don't rely on one app or method. Explore new trends (e.g., LinkedIn, YouTube, podcasts).</p>
<p><b>Mentoring Others as a Growth Strategy</b> — Teach what you know to new team members. Share resources and support their growth.</p>
<p><b>Defining Success Beyond Money</b> — Success is about impact, growth, and fulfillment. Set personal goals for learning, relationships, and contribution.</p>
<div style="border-left:4px solid #fbbf24;padding-left:12px;margin:12px 0;"><b>IMPORTANT:</b> Trends come and go. Your reputation, your network, and your values are the only things that compound over decades.</div>
<h3>💡 PRO TIP</h3>
<div style="border-left:4px solid #6366f1;padding-left:12px;margin:12px 0;">Block one hour a week for learning—watch a webinar, read an article, or try a new tool.</div>
<h3>🌍 REAL LIFE STORY</h3>
<div style="border-left:4px solid #10b981;padding-left:12px;margin:12px 0;">Amit, a digital veteran in Kathmandu, started as a freelancer, then built a team, and now mentors others. He diversified his income, stayed updated with trends, and gives back by running free digital skills workshops. His success is measured by the impact he has on others.</div>
<h3>✅ Action Steps</h3>
<ol>
  <li>Write your 1-year, 3-year, and 5-year digital career goals.</li>
  <li>Subscribe to one new industry newsletter or YouTube channel this week.</li>
  <li>Mentor a new team member or share a resource with your network.</li>
</ol>
<h3>📝 Module Summary</h3>
<p>Long-term success in digital work comes from planning, learning, and giving back. By building your brand, diversifying, and mentoring others, you create a legacy that lasts.</p>
<h3>❓ Reflection Question</h3>
<p>What does long-term success look like for you, beyond just money?</p>`
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
<p>Designing your digital future is about setting goals, tracking progress, and staying adaptable. Celebrate your journey and inspire others along the way.</p>
<h3>❓ Reflection Question</h3>
<p>What's your biggest digital goal for the next year, and what's your first step to achieve it?</p>`
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
