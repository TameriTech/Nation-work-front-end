// app/components/Footer.tsx - Footer épuré et moderne
"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="font-semibold text-lg text-gray-800 dark:text-white">
                Nation<span className="text-primary">Work</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              La plateforme qui connecte les clients et les freelances de confiance.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors group">
                <Icon icon="ph:facebook-logo" className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-primary" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors group">
                <Icon icon="ph:twitter-logo" className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-primary" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors group">
                <Icon icon="ph:linkedin-logo" className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-primary" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors group">
                <Icon icon="ph:instagram-logo" className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-primary" />
              </a>
            </div>
          </div>

          {/* Pour les clients */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Clients</h3>
            <ul className="space-y-2">
              <li><Link href="/services" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">Trouver un service</Link></li>
              <li><Link href="/prestataires" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">Nos prestataires</Link></li>
              <li><Link href="/comment-ca-marche" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">Comment ça marche</Link></li>
              <li><Link href="/faq" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Pour les freelances */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Freelances</h3>
            <ul className="space-y-2">
              <li><Link href="/devenir-freelance" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">Devenir freelance</Link></li>
              <li><Link href="/formations" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">Formations</Link></li>
              <li><Link href="/temoignages" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">Témoignages</Link></li>
              <li><Link href="/guide" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">Guide du freelance</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">Nous contacter</Link></li>
              <li><Link href="/conditions" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">Conditions générales</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">Confidentialité</Link></li>
              <li><Link href="/mentions-legales" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">Mentions légales</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © {currentYear} Tameri Work. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <Link href="/conditions" className="text-xs text-gray-400 hover:text-primary transition-colors">CGU</Link>
            <Link href="/privacy" className="text-xs text-gray-400 hover:text-primary transition-colors">Confidentialité</Link>
            <Link href="/cookies" className="text-xs text-gray-400 hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}