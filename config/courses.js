const courses = {
  starter: {
    key: 'starter',
    name: 'Starter Package',
    title: 'Digital Foundations',
    price: 499,
    currency: '₹',
    description: 'Perfect for beginners starting their online journey.',
    icon: 'bx-rocket',
    borderColor: '#3B82F6',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=340&fit=crop',
    content: [
      { icon: 'bx-mobile-alt', text: 'Social Media Basics & Personal Branding' },
      { icon: 'bx-chat', text: 'Communication Skills for Online Work' },
      { icon: 'bx-brain', text: 'Mindset & Goal Setting' },
      { icon: 'bx-wallet', text: 'Introduction to Online Earning Methods' },
      { icon: 'bx-link', text: 'How Referral Networks Work' }
    ],
    features: [
      'Social Media Basics & Personal Branding',
      'Communication Skills for Online Work',
      'Mindset & Goal Setting',
      'Introduction to Online Earning Methods',
      'How Referral Networks Work'
    ]
  },
  prime: {
    key: 'prime',
    name: 'Prime Package',
    title: 'Growth Accelerator',
    price: 699,
    currency: '₹',
    description: 'For those ready to grow faster and earn smarter.',
    icon: 'bx-trending-up',
    borderColor: '#8B5CF6',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=340&fit=crop',
    content: [
      { icon: 'bx-trending-up', text: 'Advanced Referral Strategies' },
      { icon: 'bx-target-lock', text: 'Target Audience & Marketing Basics' },
      { icon: 'bx-wrench', text: 'Free Tools for Digital Workers' },
      { icon: 'bx-bar-chart-alt-2', text: 'Tracking Your Growth & Earnings' },
      { icon: 'bx-group', text: 'Building Your Team & Network' }
    ],
    features: [
      'Advanced Referral Strategies',
      'Target Audience & Marketing Basics',
      'Free Tools for Digital Workers',
      'Tracking Your Growth & Earnings',
      'Building Your Team & Network'
    ]
  },
  master: {
    key: 'master',
    name: 'Master Package',
    title: 'Leadership & Mastery',
    price: 1599,
    currency: '₹',
    description: 'For serious earners who want to lead and scale.',
    icon: 'bx-crown',
    borderColor: '#D4A843',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=340&fit=crop',
    content: [
      { icon: 'bx-trophy', text: 'Leadership & Team Management' },
      { icon: 'bx-megaphone', text: 'Content Creation & Video Marketing' },
      { icon: 'bx-briefcase', text: 'Building a Personal Brand Online' },
      { icon: 'bx-phone', text: 'WhatsApp & Social Media Funnels' },
      { icon: 'bx-calculator', text: 'Financial Planning for Online Earners' },
      { icon: 'bx-shield', text: 'Online Safety & Scam Awareness' }
    ],
    features: [
      'Leadership & Team Management',
      'Content Creation & Video Marketing',
      'Building a Personal Brand Online',
      'WhatsApp & Social Media Funnels',
      'Financial Planning for Online Earners',
      'Online Safety & Scam Awareness'
    ]
  },
  everything: {
    key: 'everything',
    name: 'Everything Bundle',
    title: 'Complete Growing Up System',
    price: 1999,
    currency: '₹',
    description: 'All courses. Full access. Maximum earning.',
    icon: 'bx-package',
    borderColor: 'linear-gradient(135deg, #3B82F6, #D4A843)',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=340&fit=crop',
    badge: 'BEST VALUE',
    content: [
      { icon: 'bx-check-double', text: 'Everything in Starter + Prime + Master' },
      { icon: 'bx-gift', text: 'Bonus: Exclusive community group access' },
      { icon: 'bxl-whatsapp', text: 'Priority WhatsApp support' },
      { icon: 'bx-rocket', text: 'Early access to new course content' }
    ],
    features: [
      'Everything in Starter + Prime + Master',
      'Bonus: Exclusive community group access',
      'Priority WhatsApp support',
      'Early access to new course content'
    ]
  }
};

module.exports = courses;
