import { BookOpen, HelpCircle, ExternalLink } from "lucide-react";

export default function AidePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display text-imperial-gold">Aide de Camp</h1>
        <p className="text-imperial-muted font-subtitle text-lg mt-1">
          Documentation et guide d&apos;utilisation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-imperial">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-imperial-gold" />
            <h3 className="font-display text-imperial-gold">Guide rapide</h3>
          </div>
          <div className="space-y-4 text-sm text-imperial-cream/80">
            <div>
              <h4 className="font-subtitle text-imperial-gold text-base mb-1">Tableau de Campagne</h4>
              <p>Vue d&apos;ensemble avec KPIs, graphiques d&apos;activité et dernières actions des agents.</p>
            </div>
            <div>
              <h4 className="font-subtitle text-imperial-gold text-base mb-1">Les Maréchaux</h4>
              <p>Fiches détaillées de chaque agent IA avec leur rôle, modèle et statut actuel.</p>
            </div>
            <div>
              <h4 className="font-subtitle text-imperial-gold text-base mb-1">Journal de Campagne</h4>
              <p>Historique complet de toutes les actions avec filtres par agent, type et canal.</p>
            </div>
            <div>
              <h4 className="font-subtitle text-imperial-gold text-base mb-1">Trésor de Guerre</h4>
              <p>Suivi des dépenses en tokens et coûts USD par agent et par modèle.</p>
            </div>
          </div>
        </div>

        <div className="card-imperial">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-imperial-gold" />
            <h3 className="font-display text-imperial-gold">Glossaire napoléonien</h3>
          </div>
          <div className="space-y-3 text-sm">
            {[
              ["Maréchaux", "Les agents IA déployés dans l'écosystème"],
              ["Campagne", "Période d'activité et de missions"],
              ["Dépêches", "Alertes et notifications système"],
              ["Trésor de Guerre", "Budget et consommation de ressources"],
              ["État-Major", "Configuration et administration"],
              ["Quartier Général", "Ce tableau de bord de commandement"],
            ].map(([term, def]) => (
              <div key={term} className="py-2 border-b border-imperial-gold/10">
                <span className="font-badge text-imperial-gold text-xs">{term}</span>
                <p className="text-imperial-muted mt-0.5">{def}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card-imperial">
        <h3 className="font-display text-imperial-gold mb-4">Liens utiles</h3>
        <div className="flex flex-wrap gap-4">
          {[
            ["Documentation OpenClaw", "https://openclaw.io/docs"],
            ["Supabase Dashboard", "https://supabase.com/dashboard"],
            ["GitHub Repository", "https://github.com/guillaumevergano/quartier-general"],
          ].map(([label, url]) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-imperial-muted hover:text-imperial-gold transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
