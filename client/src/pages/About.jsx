import React from 'react'


export default function About() {

    return (
        <div className="bg-gray-100 p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-10 transition-transform transform duration-500 ease-in-out hover:scale-105 hover:shadow-2xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b-4 border-indigo-500 pb-2 animate-fade-in-up hover:text-teal-500 transition duration-300">
                About Us
            </h1>
            <p className="text-gray-700 leading-relaxed text-lg tracking-wide space-y-6">Welcome to <span className="font-semibold text-indigo-600">Estate Navigator</span>, your ultimate destination for seamless real estate experiences. With a focus on connecting property buyers, sellers, and renters, Estate Navigator empowers users with cutting-edge tools and insights to navigate the world of real estate effortlessly.<br></br>
                Our platform boasts an extensive and dynamic marketplace featuring a wide array of residential and commercial properties, supported by powerful features like advanced search filters, real-time chat, and AI-driven property recommendations. Whether you’re looking to find your dream home, list a property, or explore investment opportunities, Estate Navigator is your trusted partner every step of the way.<br></br>
                We go beyond transactions to provide holistic services, including personalized insights into market trends, predictive analytics for property value forecasting, and tools to help you make informed decisions. At Estate Navigator, we’re committed to making your journey in real estate smooth, transparent, and rewarding. <br></br>

                <span className="font-semibold text-gray-800">Join us</span> and discover a smarter way to navigate the real estate landscape.</p>

        </div>

    )
}

