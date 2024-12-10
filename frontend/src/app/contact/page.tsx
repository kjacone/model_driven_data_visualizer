import React from 'react';

const ContactUs = () => {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-16">
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Contact Us</h1>
      <p className="text-xl">Get in touch with us</p>
      <form className="mt-8 space-y-4" action="https://formspree.io/f/xoqkqkdv" method="POST">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-lg font-medium">Name</label>
          <input type="text" name="name" id="name" className="w-full px-4 py-2 border-b border-gray-300" />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="block text-lg font-medium">Email</label>
          <input type="email" name="email" id="email" className="w-full px-4 py-2 border-b border-gray-300" />
        </div>
        <div className="space-y-2">
          <label htmlFor="message" className="block text-lg font-medium">Message</label>
          <textarea name="message" id="message" className="w-full px-4 py-2 border-b border-gray-300" rows={8} />
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Send</button>
      </form>
    </div>
    </div>
  );
};

export default ContactUs;

