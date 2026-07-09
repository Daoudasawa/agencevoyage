import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from '../ui/SectionWrapper';
import { PhoneOutlined, MailOutlined, MessageOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { FaWhatsapp } from 'react-icons/fa6';

interface ContactSectionProps {
  contactInfo?: Record<string, string>;
}

const ContactSection: React.FC<ContactSectionProps> = ({ contactInfo = {} }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('hajj');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API request to backend to save lead/inquiry
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 1500);
  };

  const agencyPhone = contactInfo.phone || '+226 25 30 00 00';
  const agencyEmail = contactInfo.email || 'contact@agencehajjomra.bf';
  const agencyAddress = contactInfo.address || 'Avenue Kwamé N\'Krumah, Ouagadougou, Burkina Faso';
  const whatsappNumber = contactInfo.whatsapp || '+22670000000';

  return (
    <SectionWrapper id="contact" bgColor="light">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold uppercase tracking-wider">
          Contactez-nous
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mt-2">
          Une Question ? Parlons-en Ensemble
        </h2>
        <p className="mt-4 text-lg text-zinc-550 dark:text-zinc-400">
          Nos conseillers sont disponibles pour répondre à toutes vos interrogations logistiques ou administratives.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact details & Map (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-3xl p-8 border border-gray-100 dark:border-zinc-800 space-y-6">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Coordonnées de l'Agence</h3>
            
            {/* Address */}
            <div className="flex gap-4">
              <span className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center shrink-0">
                <EnvironmentOutlined className="text-emerald-600 text-lg" />
              </span>
              <div>
                <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Adresse</span>
                <p className="text-zinc-700 dark:text-zinc-350 text-sm mt-1 font-semibold">{agencyAddress}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4">
              <span className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center shrink-0">
                <PhoneOutlined className="text-emerald-600 text-lg" />
              </span>
              <div>
                <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Téléphone</span>
                <p className="text-zinc-700 dark:text-zinc-350 text-sm mt-1 font-semibold">
                  <a href={`tel:${agencyPhone}`} className="hover:underline">{agencyPhone}</a>
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4">
              <span className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center shrink-0">
                <MailOutlined className="text-emerald-600 text-lg" />
              </span>
              <div>
                <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">E-mail</span>
                <p className="text-zinc-700 dark:text-zinc-350 text-sm mt-1 font-semibold">
                  <a href={`mailto:${agencyEmail}`} className="hover:underline">{agencyEmail}</a>
                </p>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex gap-4">
              <span className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center shrink-0">
                <FaWhatsapp className="text-emerald-600 text-lg" />
              </span>
              <div>
                <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">WhatsApp</span>
                <p className="text-zinc-700 dark:text-zinc-350 text-sm mt-1 font-semibold">
                  <a 
                    href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Lien direct WhatsApp
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Map Integration */}
          <div className="rounded-3xl overflow-hidden shadow-sm h-64 border border-zinc-150 dark:border-zinc-800">
            <iframe
              title="Google Map Agence Ouagadougou"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m13!1d3900.589886738981!2d-1.520443924167156!3d12.360299687903823!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xe2db42838706d39%3A0xc3910c010d296213!2sAvenue%20Kwame%20N&#39;Krumah%2C%20Ouagadougou!5e0!3m2!1sfr!2sbf!4v1719266854508!5m2!1sfr!2sbf"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-gray-150 dark:border-zinc-800 shadow-sm">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Envoyer un Message</h3>

            {submitted ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900 flex flex-col items-center text-center space-y-3"
              >
                <span className="text-4xl">🎉</span>
                <h4 className="font-bold text-lg">Message envoyé avec succès !</h4>
                <p className="text-sm max-w-sm">
                  Merci pour votre message. Nos conseillers spirituels et logistiques vous répondront par e-mail ou téléphone sous 24h.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Envoyer un autre message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Nom Complet</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Moussa Ouédraogo"
                      className="w-full bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-4 py-3 rounded-xl border border-transparent focus:border-emerald-500 outline-none text-sm font-medium transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">N° de Téléphone</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ex: +226 70 12 34 56"
                      className="w-full bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-4 py-3 rounded-xl border border-transparent focus:border-emerald-500 outline-none text-sm font-medium transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Adresse E-mail</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ex: moussa@example.com"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-4 py-3 rounded-xl border border-transparent focus:border-emerald-500 outline-none text-sm font-medium transition-all"
                  />
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Objet de la Demande</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-4 py-3 rounded-xl border border-transparent focus:border-emerald-500 outline-none text-sm font-medium transition-all appearance-none cursor-pointer"
                  >
                    <option value="hajj">Renseignements Hajj 2026</option>
                    <option value="omra">Renseignements Omra 2026</option>
                    <option value="devis">Demande de devis de groupe</option>
                    <option value="autre">Autre demande</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Votre Message</label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Saisissez votre question ou demande ici..."
                    className="w-full bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-4 py-3 rounded-xl border border-transparent focus:border-emerald-500 outline-none text-sm font-medium transition-all resize-none"
                  ></textarea>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <MessageOutlined className="text-base" />
                  {submitting ? 'Envoi en cours...' : 'Envoyer ma Demande'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default ContactSection;
