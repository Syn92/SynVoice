'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface ContactFormProps {
  dict: {
    contact: {
      heading: string;
      subheading: string;
      form: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        company: string;
        website: string;
        message: string;
        submit: string;
        reset: string;
        required: string;
        success: string;
        validation: {
          required: string;
          email: string;
        };
      };
    };
  };
  lang: 'en' | 'fr';
}

export default function ContactForm({ dict, lang }: ContactFormProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // Validate required fields
    const requiredFields = ['Last Name', 'Email', 'Phone', 'Company'];
    const fieldLabels = {
      'Last Name': dict.contact.form.lastName,
      'Email': dict.contact.form.email,
      'Phone': dict.contact.form.phone,
      'Company': dict.contact.form.company,
    };

    for (const field of requiredFields) {
      const value = formData.get(field) as string;
      if (!value || value.trim().length === 0) {
        alert(dict.contact.form.validation.required.replace('{field}', fieldLabels[field as keyof typeof fieldLabels]));
        return;
      }
    }

    // Validate email
    const email = formData.get('Email') as string;
    if (email) {
      const atpos = email.indexOf('@');
      const dotpos = email.lastIndexOf('.');
      if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= email.length) {
        alert(dict.contact.form.validation.email);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Submit to Zoho CRM
      const response = await fetch('https://crm.zohocloud.ca/crm/WebToLeadForm', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setShowSuccess(true);
        form.reset();
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        throw new Error('Submission failed');
      }
          } catch (error) {
        alert(`An error occurred. Please try again. ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Zoho Analytics Tracking */}
          {lang === 'en' ? (
            <script 
              id='wf_anal' 
              src='https://crm.zohopublic.ca/crm/WebFormAnalyticsServeServlet?rid=1feffa593bbf7f609e4eca744f22a21dcbacbddfdabaf14ac622bb5518d12b169d1d0a07fa2963169de4c874827f48f3gid39b5f70bdacd702f02d3e0fb2b3ee774cbca475f710ed2d0477524ee003fe4c7gide4d552107457cf51c086f9955bf1af58399a5d0bf799c7c1a58923efa9624297gidc65ed9f5553828beae660edd7fecd98b19ec8832b60979878fa1b321d11ebfea&tw=68a01c91000b497162c73ad391b33da6a9e612cd373ef05aaca841715b802a65'
              async
            />
          ) : (
            <script 
              id='wf_anal' 
              src='https://crm.zohopublic.ca/crm/WebFormAnalyticsServeServlet?rid=33bd5deeb9ffe0add7f959d42cf664fbf6bd06751965f37256d08145c4c63f69936a3a84ac42512cacafa769792fd688gid769cd0eb5eac23b2217e3d31f97840ceef3fb60a4abfa34e6276265c23fae3degid0b842fee774a197ddfa125736ba624c3a2574744fe4dd747a91e2c272448eabcgidccd1d9125841f7b34b89cfc8e16a2a7d0bda4bc0a6c20a6bd6ac73ac08c675fb&tw=00e8b8263f674e06ebfd86438a4b4a4597a098645a8f6379c63876374e9e3834'
              async
            />
          )}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              {dict.contact.heading}
            </h2>
            <p className="text-lg text-muted-foreground">
              {dict.contact.subheading}
            </p>
          </div>

          {showSuccess && (
            <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 flex items-center p-4 bg-[#F5FAF5] border border-[#A9D3AB] rounded-md shadow-lg max-w-[90%] min-w-[100px]">
              <div className="flex-shrink-0 w-5 h-5 bg-[#12AA67] rounded-full mr-3 flex items-center justify-center">
                <svg className="w-3 h-3 text-white transform rotate-45 translate-x-[-2px]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                </svg>
              </div>
              <span className="text-[#132C14] text-sm">{dict.contact.form.success}</span>
            </div>
          )}

          <div className="bg-card border rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Hidden Zoho fields - Different values for EN and FR */}
              {lang === 'en' ? (
                <>
                  <input type="hidden" name="xnQsjsdp" value="838f4c24522d16268f2a26de1503be324b09a261c87ec1f13ce10b58bb47657e" />
                  <input type="hidden" name="xmIwtLD" value="ef6b6f1638d324023220a9924a2e42341d80de19b1c6b1f9d7ad9e3bd2cf61df9850ee013a039c63325fbad86948c4b6" />
                </>
              ) : (
                <>
                  <input type="hidden" name="xnQsjsdp" value="64e657d507d49f6ae8b1c2fec28119fcfa3b7381e89bcc59e587d31ba652739b" />
                  <input type="hidden" name="xmIwtLD" value="2350345c0c59e29dc2b299b7655cae54eb772192a65e7d48fbaaaccefc6ae95760b27f9bdb38e0fe1071ca45f825e07e" />
                </>
              )}
              <input type="hidden" name="zc_gad" value="" />
              <input type="hidden" name="actionType" value="TGVhZHM=" />
              <input type="hidden" name="returnURL" value="null" />
              <input type="hidden" name="Lead Source" value="Form Site Web" />
              <input type="hidden" name="LEADCF2" value={lang === 'fr' ? 'Français' : 'Anglais'} />
              <input type="hidden" name="aG9uZXlwb3Q" value="" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">
                    {dict.contact.form.firstName}
                  </label>
                  <Input
                    id="firstName"
                    name="First Name"
                    type="text"
                    maxLength={40}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">
                    {dict.contact.form.lastName}
                    <span className="text-red-500 ml-1">{dict.contact.form.required}</span>
                  </label>
                  <Input
                    id="lastName"
                    name="Last Name"
                    type="text"
                    required
                    maxLength={80}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  {dict.contact.form.email}
                  <span className="text-red-500 ml-1">{dict.contact.form.required}</span>
                </label>
                <Input
                  id="email"
                  name="Email"
                  type="email"
                  required
                  maxLength={100}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    {dict.contact.form.phone}
                    <span className="text-red-500 ml-1">{dict.contact.form.required}</span>
                  </label>
                  <Input
                    id="phone"
                    name="Phone"
                    type="tel"
                    required
                    maxLength={30}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium">
                    {dict.contact.form.company}
                    <span className="text-red-500 ml-1">{dict.contact.form.required}</span>
                  </label>
                  <Input
                    id="company"
                    name="Company"
                    type="text"
                    required
                    maxLength={200}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="website" className="text-sm font-medium">
                  {dict.contact.form.website}
                </label>
                <Input
                  id="website"
                  name="Website"
                  type="url"
                  maxLength={255}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  {dict.contact.form.message}
                </label>
                <textarea
                  id="message"
                  name="Description"
                  rows={4}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <Separator />

              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto sm:min-w-[200px] px-12"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {dict.contact.form.submit}
                    </div>
                  ) : (
                    dict.contact.form.submit
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
} 