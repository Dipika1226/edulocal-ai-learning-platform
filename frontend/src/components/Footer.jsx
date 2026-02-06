export default function Footer() {
  return (
    <footer className="bg-purple-50 border-t border-purple-100">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-purple-600">
                EduLocal
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Empowering rural women through AI-powered education in local
              languages. Learn anytime, anywhere.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="hover:text-purple-600 cursor-pointer">Features</li>
              <li className="hover:text-purple-600 cursor-pointer">
                How It Works
              </li>
              <li className="hover:text-purple-600 cursor-pointer">
                Get Started
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Community</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="hover:text-purple-600 cursor-pointer">Learners</li>
              <li className="hover:text-purple-600 cursor-pointer">
                NGO Partners
              </li>
              <li className="hover:text-purple-600 cursor-pointer">
                Success Stories
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="hover:text-purple-600 cursor-pointer">
                Help Center
              </li>
              <li className="hover:text-purple-600 cursor-pointer">
                Contact Us
              </li>
              <li className="hover:text-purple-600 cursor-pointer">
                Privacy Policy
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-purple-100 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>© {new Date().getFullYear()} EduLocal. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Built with ❤️ for accessible education</p>
        </div>
      </div>
    </footer>
  );
}
