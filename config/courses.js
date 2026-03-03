const courses = {
  starter: {
    key: 'starter',
    name: 'Starter Package',
    price: 499,
    currency: '₹',
    description: 'Perfect for beginners — get started with core fundamentals.',
    features: ['Core course modules', 'Community access', 'Basic support']
  },
  prime: {
    key: 'prime',
    name: 'Prime Package',
    price: 699,
    currency: '₹',
    description: 'Level up with advanced strategies and tools.',
    features: ['Everything in Starter', 'Advanced modules', 'Priority support', 'Bonus resources']
  },
  master: {
    key: 'master',
    name: 'Master Package',
    price: 1599,
    currency: '₹',
    description: 'Master-level content for serious learners.',
    features: ['Everything in Prime', 'Expert-level modules', '1-on-1 mentoring session', 'Certificate of completion']
  },
  everything: {
    key: 'everything',
    name: 'Everything Bundle',
    price: 1999,
    currency: '₹',
    description: 'Get everything we offer — ultimate value package.',
    features: ['All courses included', 'Lifetime access', 'VIP support', 'All future updates', 'Exclusive community']
  }
};

module.exports = courses;
