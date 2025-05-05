export default function Footer() {
    return (
      <footer className="bg-[#0C1A3E] text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Logo and tagline */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold">JCUBE AI <span className="font-light">RESUSME BUILDER</span></h2>
            <p className="text-gray-400 mt-2">Get the job you deserve, faster.</p>
          </div>
  
          {/* Footer grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            {/* Column 1 */}
            <div>
              <h3 className="font-semibold mb-3">Improve your resume</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Score my resume</li>
                <li>Targeted resume</li>
              </ul>
            </div>
  
            {/* Column 2 */}
            <div>
              <h3 className="font-semibold mb-3">Write your resume</h3>
              <ul className="space-y-2 text-gray-300">
                <li>ATS resume templates</li>
                <li>ATS resume test</li>
                <li>ATS resume guide</li>
                <li>Resume helper</li>
                <li>Resume proofreader</li>
                <li>Rate my resume</li>
              </ul>
            </div>
  
            {/* Column 3 */}
            <div>
              <h3 className="font-semibold mb-3">Optimize your career</h3>
              <ul className="space-y-2 text-gray-300">
                <li>LinkedIn review</li>
                <li>Optimize your LinkedIn profile</li>
                <li>LinkedIn headline samples</li>
                <li>Networking emails</li>
                <li>AI cover letter generator</li>
              </ul>
            </div>
  
            {/* Column 4 */}
            <div>
              <h3 className="font-semibold mb-3">Get to know us</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Help center</li>
                <li>Get in touch</li>
                <li>For businesses</li>
                <li>For resume writers</li>
                <li>Affiliates</li>
              </ul>
            </div>
          </div>
  
          {/* Bottom links */}
          <div className="mt-10 text-sm text-gray-400 space-y-1">
            <p>Coached, our newsletter</p>
            <p>Testimonials</p>
            <p>Privacy</p>
            <p>Terms</p>
          </div>
        </div>
      </footer>
    );
  }
  