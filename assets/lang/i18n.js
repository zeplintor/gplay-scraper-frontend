(function() {
    const translations = {
        fr: {
            common: {
                language_label: 'Langue',
                languages: {
                    fr: 'Français',
                    en: 'English',
                    ar: 'العربية',
                    zh: '中文'
                }
            },
            premium: {
                header: {
                    title: 'PlayStore Analytics Pro',
                    subtitle: 'Rapport Premium ultra détaillé',
                    badge: 'Dashboard Premium',
                    status_label: 'Statut licence',
                    status_placeholder: 'En attente',
                    links: {
                        home: 'Accueil',
                        pricing: 'Tarifs',
                        support: 'Support'
                    }
                },
                status: {
                    free: {
                        title: 'Mode Gratuit',
                        description: 'Analyses gratuites aujourd\'hui',
                        remaining: '{count}/3 restantes',
                        cta: '💎 Passer Premium'
                    },
                    premium: {
                        title: 'Premium Actif',
                        description: 'Analyses illimitées • Toutes les fonctionnalités débloquées'
                    }
                },
                search: {
                    title: 'Recherche d’applications',
                    subtitle: 'Identifiez les opportunités Play Store en quelques secondes.',
                    input_name: '🔍 Rechercher une application par nom',
                    input_name_placeholder: 'Ex: Roblox, Instagram, TikTok...',
                    input_id: '📱 ID de l\'application',
                    input_id_placeholder: 'Ex: com.roblox.client',
                    analyze_btn: 'Analyser'
                },
                actions: {
                    license: 'Gérer la licence',
                    share: 'Partager',
                    share_email: 'Envoyer par email',
                    share_clipboard: 'Copier un résumé',
                    export: 'Exporter'
                },
                batch: {
                    title: 'Analyse en série (CSV)',
                    subtitle: 'Importez un fichier contenant une colonne appId pour lancer des analyses successives.',
                    import_btn: 'Importer un CSV',
                    start_btn: 'Démarrer l\'analyse'
                },
                loading: 'Analyse en cours...',
                toast: {
                    missing_id: 'Veuillez entrer un ID d\'application',
                    analyze_success: 'Analyse terminée',
                    analyze_error: 'Erreur : {message}',
                    limit_reached: 'Limite gratuite atteinte (3/jour)',
                    app_selected: '{app} sélectionnée',
                    copy_success: 'Résumé copié dans le presse-papiers',
                    copy_error: 'Impossible de copier automatiquement',
                    license_activated: 'Licence activée avec succès',
                    license_invalid: 'Clé de licence invalide',
                    license_deactivated: 'Licence désactivée',
                    csv_required: 'Importez un fichier CSV avant de lancer l\'analyse',
                    batch_running: 'Une analyse est déjà en cours',
                    csv_read_error: 'Impossible de lire ce fichier CSV',
                    batch_complete: 'Analyse en série terminée',
                    generating: 'Génération en cours...',
                    quickstart_launch: '🚀 Analyse de {app} lancée !',
                    key_copied: 'Clé copiée dans le champ',
                    no_report: 'Veuillez d\'abord analyser une application',
                    export_success: 'Export réussi',
                    export_error: 'Erreur lors de l\'export : {message}',
                    analyze_before_share: 'Analysez une application avant de partager',
                    csv_invalid: 'CSV vide ou colonne appId introuvable',
                    report_loaded: 'Rapport chargé : {name}',
                    batch_item_failed: 'Échec pour {app}'
                },
                errors: {
                    format: 'Format invalide. Le format attendu est : PSAP-XXXX-XXXX-XXXX-XXXX'
                },
                share: {
                    summary_title: 'Rapport PlayStore – {title}',
                    summary_id: 'ID : {id}',
                    summary_rating: 'Note moyenne : {rating}',
                    summary_reviews: 'Avis : {reviews}',
                    summary_installs: 'Installations : {installs}',
                    summary_category: 'Catégorie : {category}',
                    summary_link: 'Lien : {link}',
                    unknown_app: 'Application',
                    generated_with: 'Généré avec PlayStore Analytics Pro.'
                },
                welcome: {
                    title: 'Bienvenue sur PlayStore Analytics Pro !',
                    subtitle: 'Découvrez la puissance de l\'analyse Play Store en quelques clics',
                    step1_title: 'Recherchez une application',
                    step1_desc: 'Tapez le nom d\'une app ou essayez avec nos exemples populaires',
                    step2_title: 'Analysez les données',
                    step2_desc: '3 analyses gratuites par jour • Données en temps réel',
                    step3_title: 'Exportez vos rapports',
                    step3_desc: 'PDF, CSV, JSON • Format professionnel prêt à partager',
                    quickstart_title: '🚀 Démarrage rapide',
                    start: 'Commencer l\'exploration',
                    skip: 'Passer l\'introduction',
                    footer: '💡 Astuce : Vous pouvez analyser gratuitement 3 applications par jour'
                },
                license: {
                    modal_title: 'Activer votre licence Premium',
                    modal_subtitle: 'Entrez votre clé de licence pour débloquer toutes les fonctionnalités',
                    input_label: 'Clé de licence',
                    activate_btn: 'Activer la licence',
                    buy_btn: '💳 Acheter une licence (9,99€)',
                    test_keys_title: 'Clés de test disponibles :',
                    test_hint: 'Cliquez sur une clé pour la copier',
                    active_title: 'Licence Premium Active',
                    active_subtitle: 'Profitez de toutes les fonctionnalités illimitées',
                    info_email: '📧 Email',
                    info_key: '🔑 Clé',
                    info_activated: '📅 Activée le',
                    info_status: '⏰ Statut',
                    features_title: 'Fonctionnalités débloquées :',
                    feature_unlimited: 'Analyses illimitées',
                    feature_metrics: '65+ métriques avancées',
                    feature_export: 'Export PDF professionnel',
                    feature_batch: 'Analyse CSV en batch',
                    feature_support: 'Support prioritaire',
                    deactivate_btn: 'Désactiver la licence',
                    status_active: '✓ Active',
                    confirm_deactivate: 'Êtes-vous sûr de vouloir désactiver votre licence Premium ?',
                    activating: '🔄 Validation en cours...'
                },
                paywall: {
                    title: 'Limite gratuite atteinte !',
                    subtitle: 'Vous avez utilisé vos 3 analyses gratuites aujourd\'hui.',
                    free_title: 'Gratuit',
                    free_price: '0€',
                    free_features: [
                        '3 analyses par jour',
                        'Données de base uniquement',
                        'Export avec watermark',
                        'Sections premium floutées'
                    ],
                    premium_badge: 'RECOMMANDÉ',
                    premium_title: 'Premium',
                    premium_price: '9,99€',
                    premium_features: [
                        '✓ Analyses illimitées',
                        '✓ 65+ métriques complètes',
                        '✓ Export PDF professionnel',
                        '✓ Analyse CSV en batch',
                        '✓ Toutes sections débloquées',
                        '✓ Support prioritaire'
                    ],
                    primary_cta: '💎 Débloquer Premium - 9,99€',
                    secondary_cta: 'Revenir demain (3 nouvelles analyses)',
                    footer: '💳 Paiement sécurisé • Accès instantané • Garantie 30 jours'
                }
            },
            landing: {
                nav: {
                    why: 'Pourquoi nous ?',
                    impact: 'Impact',
                    pricing: 'Tarifs',
                    cta: 'Essayer gratuitement'
                },
                hero: {
                    tag: '🚀 Booster la croissance de vos apps Android',
                    title: 'Transformez vos décisions marketing avec la donnée Play Store en temps réel.',
                    desc: 'PlayStore Analytics Pro révèle les signaux forts du marché : potentiel d'installation, retours utilisateurs, concurrents clés et opportunités de positionnement.',
                    primary: 'Essayer gratuitement (3 analyses/jour)',
                    secondary: 'Voir les résultats clients',
                    note: 'Aucune carte bancaire requise • Licence Premium à 9,99€ (paiement unique)'
                },
                metrics: [
                    '+42% de visibilité moyenne gagnée par nos clients',
                    '65+ indicateurs analysés par application',
                    '5 min pour identifier une opportunité marché'
                ],
                benefits_title: 'Pourquoi choisir PlayStore Analytics Pro ?',
                benefits_subtitle: 'Une solution pensée pour les équipes marketing ambitieuses qui veulent devancer la concurrence.',
                benefits: [
                    {
                        title: 'Vision marché complète',
                        desc: 'Analysez instantanément n’importe quelle app avec une profondeur de données unique.'
                    },
                    {
                        title: 'Décisions accélérées',
                        desc: 'Priorisez vos chantiers ASO grâce à des insights clairs, triés par impact potentiel.'
                    },
                    {
                        title: 'Rapports premium',
                        desc: 'Produisez des rapports prêts à partager en interne ou auprès de vos clients.'
                    },
                    {
                        title: 'Collaboration fluide',
                        desc: 'Gardez un historique centralisé et alignez toutes les équipes sur les mêmes données.'
                    }
                ],
                impact_title: 'Des résultats qui parlent',
                demo: {
                    title: 'Un rapport premium ultra visuel, prêt à partager.',
                    desc: 'Voici le rendu exact que vos clients ou votre direction recevront : graphiques soignés, insights actionnables, storytelling fluide.',
                    points: [
                        'Plus de 20 pages de graphiques et recommandations',
                        'Mise en page premium prête à envoyer (PDF)',
                        'Sections personnalisation : branding, commentaire, next steps'
                    ],
                    cards: [
                        { title: 'Courbes de croissance', desc: 'Installs vs. concurrents semaine après semaine.' },
                        { title: 'Histogramme de notes', desc: 'Répartition 1★ à 5★ avec alertes de churn.' },
                        { title: 'Insights ASO', desc: 'Keywords gagnants, recommandations actionnables.' },
                        { title: 'Tableaux comparatifs', desc: 'Benchmarks UX, monétisation, features critiques.' }
                    ]
                },
                pricing_title: 'Des offres adaptées à chaque étape',
                pricing_subtitle: 'Essayez gratuitement, activez la puissance premium quand vous en avez besoin.',
                cta_banner: {
                    title: 'Prêt à débloquer le plein potentiel ?',
                    desc: 'Démarrez gratuitement ou passez directement Premium pour 9,99€ — paiement unique, analyses illimitées à vie.',
                    primary: 'Obtenir Premium (9,99€)',
                    secondary: 'Essayer gratuitement'
                },
                footer: {
                    dashboard: 'Dashboard',
                    contact: 'Contact',
                    legal: 'Mentions légales'
                }
            },
            pricing: {
                hero_tag: 'Plans flexibles pour votre équipe ASO',
                hero_title: 'Choisissez l’offre PlayStore Analytics Pro qui correspond à votre stade de croissance.',
                hero_desc: 'Comparez les fonctionnalités et activez votre licence Premium en un clic.',
                billing_monthly: 'Mensuel',
                billing_yearly: 'Annuel',
                discount: '-20% en annuel',
                cards: [
                    {
                        title: 'Starter',
                        tag: 'Idéal pour démarrer',
                        price: '0€',
                        period: '/ utilisateur',
                        cta: 'Essayer gratuitement'
                    },
                    {
                        title: 'Premium',
                        tag: 'Le plus populaire',
                        price: '9,99€',
                        period: '/ rapport',
                        cta: 'Débloquer Premium'
                    },
                    {
                        title: 'Équipe',
                        tag: 'Pour les grandes structures',
                        price: 'Sur devis',
                        period: '',
                        cta: 'Planifier un call'
                    }
                ],
                comparison_title: 'Comparatif des fonctionnalités',
                faq_title: 'Questions fréquentes',
                contact_cta: 'Besoin d’un plan personnalisé ?'
            }
        },
        en: {
            common: {
                language_label: 'Language',
                languages: {
                    fr: 'Français',
                    en: 'English',
                    ar: 'العربية',
                    zh: '中文'
                }
            },
            premium: {
                header: {
                    title: 'PlayStore Analytics Pro',
                    subtitle: 'Ultra-detailed premium report',
                    badge: 'Premium Dashboard',
                    status_label: 'License status',
                    status_placeholder: 'Pending',
                    links: {
                        home: 'Home',
                        pricing: 'Pricing',
                        support: 'Support'
                    }
                },
                status: {
                    free: {
                        title: 'Free Mode',
                        description: 'Free analyses available today',
                        remaining: '{count}/3 remaining',
                        cta: '💎 Upgrade to Premium'
                    },
                    premium: {
                        title: 'Premium Active',
                        description: 'Unlimited analyses • All features unlocked'
                    }
                },
                search: {
                    title: 'Search applications',
                    subtitle: 'Spot Play Store opportunities in seconds.',
                    input_name: '🔍 Search an app by name',
                    input_name_placeholder: 'e.g. Roblox, Instagram, TikTok...',
                    input_id: '📱 Application ID',
                    input_id_placeholder: 'e.g. com.roblox.client',
                    analyze_btn: 'Analyze'
                },
                actions: {
                    license: 'Manage license',
                    share: 'Share',
                    share_email: 'Send by email',
                    share_clipboard: 'Copy summary',
                    export: 'Export'
                },
                batch: {
                    title: 'Batch analysis (CSV)',
                    subtitle: 'Upload a file containing an appId column to run sequential analyses.',
                    import_btn: 'Upload CSV',
                    start_btn: 'Start analysis'
                },
                loading: 'Analyzing...',
                toast: {
                    missing_id: 'Please enter an application ID',
                    analyze_success: 'Analysis completed',
                    analyze_error: 'Error: {message}',
                    limit_reached: 'Free limit reached (3/day)',
                    app_selected: '{app} selected',
                    copy_success: 'Summary copied to clipboard',
                    copy_error: 'Unable to copy automatically',
                    license_activated: 'License activated successfully',
                    license_invalid: 'Invalid license key',
                    license_deactivated: 'License deactivated',
                    license_expired: 'License expired',
                    license_revoked: 'License revoked',
                    server_error: 'Server error. Please try again.',
                    csv_required: 'Import a CSV file before starting the batch',
                    batch_running: 'An analysis is already running',
                    csv_read_error: 'Unable to read this CSV file',
                    batch_complete: 'Batch analysis finished',
                    generating: 'Generating...',
                    quickstart_launch: '🚀 Analysis for {app} started!',
                    key_copied: 'Key copied into the field',
                    no_report: 'Please analyze an application first',
                    export_success: 'Export completed',
                    export_error: 'Export error: {message}',
                    analyze_before_share: 'Analyze an application before sharing',
                    csv_invalid: 'CSV empty or no appId column found',
                    report_loaded: 'Report loaded: {name}',
                    batch_item_failed: 'Failed for {app}'
                },
                errors: {
                    format: 'Invalid format. Expected: PSAP-XXXX-XXXX-XXXX-XXXX'
                },
                share: {
                    summary_title: 'PlayStore Report – {title}',
                    summary_id: 'ID: {id}',
                    summary_rating: 'Average rating: {rating}',
                    summary_reviews: 'Reviews: {reviews}',
                    summary_installs: 'Installs: {installs}',
                    summary_category: 'Category: {category}',
                    summary_link: 'Link: {link}',
                    unknown_app: 'Application',
                    generated_with: 'Generated with PlayStore Analytics Pro.'
                },
                welcome: {
                    title: 'Welcome to PlayStore Analytics Pro!',
                    subtitle: 'Discover Play Store analytics power in a few clicks',
                    step1_title: 'Search an application',
                    step1_desc: 'Type the name of an app or use our popular examples',
                    step2_title: 'Analyze the data',
                    step2_desc: '3 free analyses per day • Real-time data',
                    step3_title: 'Export your reports',
                    step3_desc: 'PDF, CSV, JSON • Professional format ready to share',
                    quickstart_title: '🚀 Quick start',
                    start: 'Start exploring',
                    skip: 'Skip intro',
                    footer: '💡 Tip: You can analyze 3 apps per day for free'
                },
                license: {
                    modal_title: 'Activate your Premium license',
                    modal_subtitle: 'Enter your license key to unlock all features',
                    input_label: 'License key',
                    activate_btn: 'Activate license',
                    buy_btn: '💳 Buy a license (€9.99)',
                    test_keys_title: 'Test keys available:',
                    test_hint: 'Click a key to copy it',
                    active_title: 'Premium license active',
                    active_subtitle: 'Enjoy unlimited access to every feature',
                    info_email: '📧 Email',
                    info_key: '🔑 Key',
                    info_activated: '📅 Activated on',
                    info_status: '⏰ Status',
                    features_title: 'Unlocked features:',
                    feature_unlimited: 'Unlimited analyses',
                    feature_metrics: '65+ advanced metrics',
                    feature_export: 'Professional PDF export',
                    feature_batch: 'CSV batch analysis',
                    feature_support: 'Priority support',
                    deactivate_btn: 'Deactivate license',
                    status_active: '✓ Active',
                    confirm_deactivate: 'Are you sure you want to deactivate your Premium license?',
                    activating: '🔄 Validating...'
                },
                paywall: {
                    title: 'Free limit reached!',
                    subtitle: 'You used your 3 free analyses today.',
                    free_title: 'Free',
                    free_price: '€0',
                    free_features: [
                        '3 analyses per day',
                        'Basic data only',
                        'Exports with watermark',
                        'Premium sections blurred'
                    ],
                    premium_badge: 'RECOMMENDED',
                    premium_title: 'Premium',
                    premium_price: '€9.99',
                    premium_features: [
                        '✓ Unlimited analyses',
                        '✓ 65+ complete metrics',
                        '✓ Professional PDF export',
                        '✓ CSV batch analysis',
                        '✓ All sections unlocked',
                        '✓ Priority support'
                    ],
                    primary_cta: '💎 Unlock Premium - €9.99',
                    secondary_cta: 'Come back tomorrow (3 new analyses)',
                    footer: '💳 Secure payment • Instant access • 30-day guarantee'
                }
            },
            landing: {
                nav: {
                    why: 'Why us?',
                    impact: 'Impact',
                    pricing: 'Pricing',
                    cta: 'Try for free'
                },
                hero: {
                    tag: '🚀 Boost your Android apps growth',
                    title: 'Turn marketing decisions into wins with real-time Play Store data.',
                    desc: 'PlayStore Analytics Pro surfaces key market signals: install potential, user feedback, competitors and positioning opportunities.',
                    primary: 'Try for free (3 analyses/day)',
                    secondary: 'See customer results',
                    note: 'No credit card required • Premium license €9.99 (one-time payment)'
                },
                metrics: [
                    '+42% average visibility lift for our clients',
                    '65+ indicators analyzed per application',
                    '5 minutes to detect a market opportunity'
                ],
                benefits_title: 'Why choose PlayStore Analytics Pro?',
                benefits_subtitle: 'A solution designed for ambitious marketing teams who want to stay ahead.',
                benefits: [
                    {
                        title: 'Complete market view',
                        desc: 'Instantly analyze any app with unmatched data depth.'
                    },
                    {
                        title: 'Faster decisions',
                        desc: 'Prioritize ASO initiatives with clear, impact-driven insights.'
                    },
                    {
                        title: 'Premium reports',
                        desc: 'Generate polished reports ready to share with stakeholders.'
                    },
                    {
                        title: 'Smooth collaboration',
                        desc: 'Keep a centralized history and align every team on the same data.'
                    }
                ],
                impact_title: 'Results that speak',
                demo: {
                    title: 'A premium report, ready to share.',
                    desc: 'See the exact output your stakeholders will receive: polished visuals, actionable insights, compelling storytelling.',
                    points: [
                        '20+ pages of charts and recommendations',
                        'Premium layout ready to send (PDF)',
                        'Customizable sections: branding, comments, next steps'
                    ],
                    cards: [
                        { title: 'Growth curves', desc: 'Installs vs competitors week after week.' },
                        { title: 'Rating histogram', desc: '1★ to 5★ distribution with churn alerts.' },
                        { title: 'ASO insights', desc: 'Winning keywords, actionable recommendations.' },
                        { title: 'Comparison tables', desc: 'UX, monetization and feature benchmarks.' }
                    ]
                },
                pricing_title: 'Plans for every stage',
                pricing_subtitle: 'Start for free, unlock premium power when you need it.',
                cta_banner: {
                    title: 'Ready to unlock full potential?',
                    desc: 'Start free or go Premium for €9.99 — one-time payment, unlimited analyses forever.',
                    primary: 'Get Premium (€9.99)',
                    secondary: 'Try for free'
                },
                footer: {
                    dashboard: 'Dashboard',
                    contact: 'Contact',
                    legal: 'Legal'
                }
            },
            pricing: {
                hero_tag: 'Flexible plans for your ASO team',
                hero_title: 'Pick the PlayStore Analytics Pro plan that matches your growth stage.',
                hero_desc: 'Compare features and activate your Premium license in one click.',
                billing_monthly: 'Monthly',
                billing_yearly: 'Yearly',
                discount: '-20% yearly',
                cards: [
                    { title: 'Starter', tag: 'Perfect to start', price: '€0', period: '/ user', cta: 'Try for free' },
                    { title: 'Premium', tag: 'Most popular', price: '€9.99', period: '/ report', cta: 'Unlock Premium' },
                    { title: 'Team', tag: 'For larger organizations', price: 'Custom', period: '', cta: 'Schedule a call' }
                ],
                comparison_title: 'Feature comparison',
                faq_title: 'Frequently asked questions',
                contact_cta: 'Need a custom plan?'
            }
        },
        ar: {
            common: {
                language_label: 'اللغة',
                languages: {
                    fr: 'Français',
                    en: 'English',
                    ar: 'العربية',
                    zh: '中文'
                }
            },
            premium: {
                header: {
                    title: 'PlayStore Analytics Pro',
                    subtitle: 'تقرير بريميوم مفصّل للغاية',
                    badge: 'لوحة بريميوم',
                    status_label: 'حالة الترخيص',
                    status_placeholder: 'في الانتظار',
                    links: {
                        home: 'الرئيسية',
                        pricing: 'الأسعار',
                        support: 'الدعم'
                    }
                },
                status: {
                    free: {
                        title: 'الوضع المجاني',
                        description: 'تحليلات مجانية اليوم',
                        remaining: '{count}/3 متبقية',
                        cta: '💎 الترقية إلى بريميوم'
                    },
                    premium: {
                        title: 'بريميوم مُفعّل',
                        description: 'تحليلات غير محدودة • جميع الميزات مفتوحة'
                    }
                },
                search: {
                    title: 'البحث عن التطبيقات',
                    subtitle: 'اكتشف فرص متجر Play في ثوانٍ.',
                    input_name: '🔍 ابحث عن تطبيق بالاسم',
                    input_name_placeholder: 'مثال: Roblox، Instagram، TikTok...',
                    input_id: '📱 معرّف التطبيق',
                    input_id_placeholder: 'مثال: com.roblox.client',
                    analyze_btn: 'تحليل'
                },
                actions: {
                    license: 'إدارة الترخيص',
                    share: 'مشاركة',
                    share_email: 'إرسال بالبريد',
                    share_clipboard: 'نسخ الملخص',
                    export: 'تصدير'
                },
                batch: {
                    title: 'تحليل دفعي (CSV)',
                    subtitle: 'ارفع ملفًا يحتوي على عمود appId لتشغيل تحليلات متتالية.',
                    import_btn: 'رفع ملف CSV',
                    start_btn: 'بدء التحليل'
                },
                loading: 'جاري التحليل...',
                toast: {
                    missing_id: 'يرجى إدخال معرّف التطبيق',
                    analyze_success: 'اكتمل التحليل',
                    analyze_error: 'خطأ: {message}',
                    limit_reached: 'تم بلوغ الحد المجاني (3 يوميًا)',
                    app_selected: 'تم اختيار {app}',
                    copy_success: 'تم نسخ الملخص إلى الحافظة',
                    copy_error: 'تعذّر النسخ تلقائيًا',
                    license_activated: 'تم تفعيل الترخيص بنجاح',
                    license_invalid: 'مفتاح الترخيص غير صالح',
                    license_deactivated: 'تم إلغاء تفعيل الترخيص',
                    license_expired: 'انتهت صلاحية الترخيص',
                    license_revoked: 'تم إلغاء الترخيص',
                    server_error: 'خطأ في الخادم. يرجى المحاولة لاحقًا.',
                    csv_required: 'قم برفع ملف CSV قبل بدء التحليل',
                    batch_running: 'يوجد تحليل قيد التنفيذ',
                    csv_read_error: 'تعذّر قراءة ملف CSV',
                    batch_complete: 'انتهى التحليل الدفعي',
                    generating: 'جاري التوليد...',
                    quickstart_launch: '🚀 تم بدء تحليل {app}!',
                    key_copied: 'تم نسخ المفتاح إلى الحقل',
                    no_report: 'يرجى تحليل تطبيق أولًا',
                    export_success: 'تم التصدير بنجاح',
                    export_error: 'خطأ أثناء التصدير: {message}',
                    analyze_before_share: 'حلّل تطبيقًا قبل المشاركة',
                    csv_invalid: 'ملف CSV فارغ أو عمود appId مفقود',
                    report_loaded: 'تم تحميل التقرير: {name}',
                    batch_item_failed: 'فشل التحليل لـ {app}'
                },
                errors: {
                    format: 'تنسيق غير صالح. الصيغة المتوقعة: PSAP-XXXX-XXXX-XXXX-XXXX'
                },
                share: {
                    summary_title: 'تقرير PlayStore – {title}',
                    summary_id: 'المعرّف: {id}',
                    summary_rating: 'التقييم المتوسط: {rating}',
                    summary_reviews: 'المراجعات: {reviews}',
                    summary_installs: 'عدد التنزيلات: {installs}',
                    summary_category: 'الفئة: {category}',
                    summary_link: 'الرابط: {link}',
                    unknown_app: 'تطبيق',
                    generated_with: 'تم الإنشاء عبر PlayStore Analytics Pro.'
                },
                welcome: {
                    title: 'مرحبًا بك في PlayStore Analytics Pro!',
                    subtitle: 'اكتشف قوة تحليل متجر Play في بضع نقرات',
                    step1_title: 'ابحث عن تطبيق',
                    step1_desc: 'اكتب اسم التطبيق أو استخدم أمثلتنا الشائعة',
                    step2_title: 'حلّل البيانات',
                    step2_desc: '3 تحليلات مجانية يوميًا • بيانات فورية',
                    step3_title: 'صدّر تقاريرك',
                    step3_desc: 'PDF وCSV وJSON • تنسيق احترافي جاهز للمشاركة',
                    quickstart_title: '🚀 بداية سريعة',
                    start: 'ابدأ الاستكشاف',
                    skip: 'تخطَّ المقدمة',
                    footer: '💡 نصيحة: يمكنك تحليل 3 تطبيقات مجانًا يوميًا'
                },
                license: {
                    modal_title: 'فعّل رخصة بريميوم الخاصة بك',
                    modal_subtitle: 'أدخل مفتاح الترخيص لفتح جميع الميزات',
                    input_label: 'مفتاح الترخيص',
                    activate_btn: 'تفعيل الترخيص',
                    buy_btn: '💳 شراء ترخيص (9.99€)',
                    test_keys_title: 'مفاتيح اختبار متاحة:',
                    test_hint: 'انقر على المفتاح لنسخه',
                    active_title: 'ترخيص بريميوم مُفعّل',
                    active_subtitle: 'استمتع بوصول غير محدود لكل المزايا',
                    info_email: '📧 البريد الإلكتروني',
                    info_key: '🔑 المفتاح',
                    info_activated: '📅 تاريخ التفعيل',
                    info_status: '⏰ الحالة',
                    features_title: 'المزايا المتاحة:',
                    feature_unlimited: 'تحليلات غير محدودة',
                    feature_metrics: 'أكثر من 65 مؤشرًا متقدمًا',
                    feature_export: 'تصدير PDF احترافي',
                    feature_batch: 'تحليل CSV دفعي',
                    feature_support: 'دعم أولوية',
                    deactivate_btn: 'إلغاء تفعيل الترخيص',
                    status_active: '✓ مفعلة',
                    confirm_deactivate: 'هل أنت متأكد من إلغاء تفعيل رخصة البريميوم؟',
                    activating: '🔄 جارٍ التحقق...'
                },
                paywall: {
                    title: 'تم بلوغ الحد المجاني!',
                    subtitle: 'لقد استخدمت التحليلات الثلاث المجانية اليوم.',
                    free_title: 'مجاني',
                    free_price: '0€',
                    free_features: [
                        '3 تحليلات في اليوم',
                        'بيانات أساسية فقط',
                        'تصدير مع علامة مائية',
                        'أجزاء بريميوم غير متاحة'
                    ],
                    premium_badge: 'موصى به',
                    premium_title: 'بريميوم',
                    premium_price: '9.99€',
                    premium_features: [
                        '✓ تحليلات غير محدودة',
                        '✓ أكثر من 65 مؤشرًا كاملًا',
                        '✓ تصدير PDF احترافي',
                        '✓ تحليل CSV دفعي',
                        '✓ كل الأقسام مفتوحة',
                        '✓ دعم أولوية'
                    ],
                    primary_cta: '💎 فتح بريميوم - 9.99€',
                    secondary_cta: 'العودة غدًا (3 تحليلات جديدة)',
                    footer: '💳 دفع آمن • وصول فوري • ضمان 30 يومًا'
                }
            },
            landing: {
                nav: {
                    why: 'لماذا نحن؟',
                    impact: 'الأثر',
                    pricing: 'الأسعار',
                    cta: 'جرّب مجانًا'
                },
                hero: {
                    tag: '🚀 عزز نمو تطبيقاتك على أندرويد',
                    title: 'حوّل قرارات التسويق إلى نجاحات عبر بيانات متجر Play الفورية.',
                    desc: 'يكشف PlayStore Analytics Pro إشارات السوق: الإمكانيات، تقييمات المستخدمين، المنافسون، وفرص التمركز.',
                    primary: 'جرّب مجانًا (3 تحليلات/اليوم)',
                    secondary: 'شاهد نتائج العملاء',
                    note: 'لا حاجة لبطاقة ائتمان • رخصة بريميوم 9.99€ (دفعة واحدة)'
                },
                metrics: [
                    '+%42 متوسط زيادة الظهور لعملائنا',
                    'أكثر من 65 مؤشراً يتم تحليله لكل تطبيق',
                    '5 دقائق لاكتشاف فرصة سوقية'
                ],
                benefits_title: 'لماذا تختار PlayStore Analytics Pro؟',
                benefits_subtitle: 'حل موجّه لفرق التسويق الطموحة للبقاء في الصدارة.',
                benefits: [
                    {
                        title: 'رؤية سوقية شاملة',
                        desc: 'حلّل أي تطبيق فورًا بعمق بيانات غير مسبوق.'
                    },
                    {
                        title: 'قرارات أسرع',
                        desc: 'رتّب أولويات مبادرات ASO عبر رؤى واضحة وموجّهة بالأثر.'
                    },
                    {
                        title: 'تقارير احترافية',
                        desc: 'أنشئ تقارير أنيقة جاهزة للمشاركة مع أصحاب المصلحة.'
                    },
                    {
                        title: 'تعاون سلس',
                        desc: 'حافظ على سجل مركزي ووفّق بين كل الفرق على نفس البيانات.'
                    }
                ],
                impact_title: 'نتائج تتحدث عن نفسها',
                demo: {
                    title: 'تقرير بريميوم جاهز للمشاركة.',
                    desc: 'هذا بالضبط ما سيستلمه عملاؤك أو إدارتك: رسوم جذابة، رؤى قابلة للتنفيذ، وقصة بيانات متكاملة.',
                    points: [
                        'أكثر من 20 صفحة من الرسوم والتوصيات',
                        'تنسيق PDF احترافي جاهز للإرسال',
                        'أقسام قابلة للتخصيص: الهوية، التعليقات، الخطوات التالية'
                    ],
                    cards: [
                        { title: 'منحنيات النمو', desc: 'التنزيلات مقابل المنافسين أسبوعًا بعد أسبوع.' },
                        { title: 'مخطط التقييمات', desc: 'توزيع 1★ إلى 5★ مع تنبيهات التسرب.' },
                        { title: 'رؤى ASO', desc: 'كلمات مفتاحية رابحة وتوصيات قابلة للتنفيذ.' },
                        { title: 'جداول المقارنة', desc: 'مقارنات تجربة المستخدم والربحية والميزات.' }
                    ]
                },
                pricing_title: 'خطط لكل مرحلة',
                pricing_subtitle: 'ابدأ مجانًا، وافتح قوة بريميوم عند الحاجة.',
                cta_banner: {
                    title: 'مستعد لإطلاق الطاقة الكاملة؟',
                    desc: 'ابدأ مجانًا أو انتقل مباشرة إلى بريميوم مقابل 9.99€ — دفعة واحدة، تحليلات غير محدودة مدى الحياة.',
                    primary: 'احصل على بريميوم (9.99€)',
                    secondary: 'جرّب مجانًا'
                },
                footer: {
                    dashboard: 'اللوحة',
                    contact: 'اتصل بنا',
                    legal: 'الشروط'
                }
            },
            pricing: {
                hero_tag: 'خطط مرنة لفريق ASO الخاص بك',
                hero_title: 'اختر خطة PlayStore Analytics Pro المناسبة لمرحلة نموك.',
                hero_desc: 'قارن الميزات وفعّل رخصة بريميوم بكبسة زر.',
                billing_monthly: 'شهري',
                billing_yearly: 'سنوي',
                discount: '-20% سنوي',
                cards: [
                    { title: 'مبتدئ', tag: 'مثالي للبداية', price: '0€', period: '/ مستخدم', cta: 'جرّب مجانًا' },
                    { title: 'بريميوم', tag: 'الأكثر شيوعًا', price: '9.99€', period: '/ تقرير', cta: 'فتح بريميوم' },
                    { title: 'فريق', tag: 'للشركات الكبيرة', price: 'مخصص', period: '', cta: 'حدد موعدًا' }
                ],
                comparison_title: 'مقارنة الميزات',
                faq_title: 'أسئلة متكررة',
                contact_cta: 'هل تحتاج خطة مخصصة؟'
            }
        },
        zh: {
            common: {
                language_label: '语言',
                languages: {
                    fr: '法语',
                    en: '英语',
                    ar: '阿拉伯语',
                    zh: '中文'
                }
            },
            premium: {
                header: {
                    title: 'PlayStore Analytics Pro',
                    subtitle: '超详细的高级报告',
                    badge: '高级控制台',
                    status_label: '许可证状态',
                    status_placeholder: '待确认',
                    links: {
                        home: '首页',
                        pricing: '定价',
                        support: '支持'
                    }
                },
                status: {
                    free: {
                        title: '免费模式',
                        description: '今天仍有免费分析',
                        remaining: '剩余 {count}/3',
                        cta: '💎 升级到高级版'
                    },
                    premium: {
                        title: '高级版已激活',
                        description: '无限分析 • 所有功能全部解锁'
                    }
                },
                search: {
                    title: '搜索应用',
                    subtitle: '几秒钟发现 Play 商店机会。',
                    input_name: '🔍 按名称搜索应用',
                    input_name_placeholder: '例如：Roblox、Instagram、TikTok...',
                    input_id: '📱 应用 ID',
                    input_id_placeholder: '例如：com.roblox.client',
                    analyze_btn: '开始分析'
                },
                actions: {
                    license: '管理许可证',
                    share: '分享',
                    share_email: '发送邮件',
                    share_clipboard: '复制摘要',
                    export: '导出'
                },
                batch: {
                    title: '批量分析（CSV）',
                    subtitle: '上传包含 appId 列的文件即可依次运行分析。',
                    import_btn: '上传 CSV',
                    start_btn: '开始批量分析'
                },
                loading: '正在分析...',
                toast: {
                    missing_id: '请输入应用 ID',
                    analyze_success: '分析完成',
                    analyze_error: '错误：{message}',
                    limit_reached: '已达到免费限制（每日 3 次）',
                    app_selected: '已选择 {app}',
                    copy_success: '摘要已复制到剪贴板',
                    copy_error: '无法自动复制',
                    license_activated: '许可证激活成功',
                    license_invalid: '许可证无效',
                    license_deactivated: '许可证已停用',
                    license_expired: '许可证已过期',
                    license_revoked: '许可证已撤销',
                    server_error: '服务器错误，请稍后再试。',
                    csv_required: '开始前请上传 CSV 文件',
                    batch_running: '已有任务在运行',
                    csv_read_error: '无法读取该 CSV 文件',
                    batch_complete: '批量分析完成',
                    generating: '生成中...',
                    quickstart_launch: '🚀 已开始分析 {app}！',
                    key_copied: '密钥已填入输入框',
                    no_report: '请先分析一个应用',
                    export_success: '导出成功',
                    export_error: '导出出错：{message}',
                    analyze_before_share: '分享前请先分析一个应用',
                    csv_invalid: 'CSV 为空或缺少 appId 列',
                    report_loaded: '已加载报告：{name}',
                    batch_item_failed: '{app} 分析失败'
                },
                errors: {
                    format: '格式无效，应为：PSAP-XXXX-XXXX-XXXX-XXXX'
                },
                share: {
                    summary_title: 'PlayStore 报告 – {title}',
                    summary_id: 'ID：{id}',
                    summary_rating: '平均评分：{rating}',
                    summary_reviews: '评论数：{reviews}',
                    summary_installs: '安装量：{installs}',
                    summary_category: '类别：{category}',
                    summary_link: '链接：{link}',
                    unknown_app: '应用',
                    generated_with: '由 PlayStore Analytics Pro 生成。'
                },
                welcome: {
                    title: '欢迎使用 PlayStore Analytics Pro！',
                    subtitle: '几次点击即可掌握 Play 商店分析的力量',
                    step1_title: '搜索应用',
                    step1_desc: '输入应用名称或选择热门示例',
                    step2_title: '分析数据',
                    step2_desc: '每日 3 次免费分析 • 实时数据',
                    step3_title: '导出报告',
                    step3_desc: 'PDF、CSV、JSON • 专业格式随时分享',
                    quickstart_title: '🚀 快速开始',
                    start: '立即探索',
                    skip: '跳过介绍',
                    footer: '💡 小贴士：每天可免费分析 3 个应用'
                },
                license: {
                    modal_title: '激活您的高级许可证',
                    modal_subtitle: '输入许可证密钥即可解锁全部功能',
                    input_label: '许可证密钥',
                    activate_btn: '激活许可证',
                    buy_btn: '💳 购买许可证（9.99€）',
                    test_keys_title: '可用测试密钥：',
                    test_hint: '点击即可复制',
                    active_title: '高级许可证已激活',
                    active_subtitle: '享受所有功能的无限制访问',
                    info_email: '📧 邮箱',
                    info_key: '🔑 密钥',
                    info_activated: '📅 激活日期',
                    info_status: '⏰ 状态',
                    features_title: '已解锁功能：',
                    feature_unlimited: '无限制分析',
                    feature_metrics: '65+ 高级指标',
                    feature_export: '专业 PDF 导出',
                    feature_batch: 'CSV 批量分析',
                    feature_support: '优先支持',
                    deactivate_btn: '停用许可证',
                    status_active: '✓ 已激活',
                    confirm_deactivate: '确定要停用高级许可证吗？',
                    activating: '🔄 正在验证...'
                },
                paywall: {
                    title: '已达到免费额度！',
                    subtitle: '您今天的 3 次免费分析已用完。',
                    free_title: '免费',
                    free_price: '0€',
                    free_features: [
                        '每天 3 次分析',
                        '仅提供基础数据',
                        '导出带水印',
                        '高级内容不可见'
                    ],
                    premium_badge: '推荐',
                    premium_title: '高级版',
                    premium_price: '9.99€',
                    premium_features: [
                        '✓ 分析无限制',
                        '✓ 65+ 完整指标',
                        '✓ 专业 PDF 导出',
                        '✓ CSV 批量分析',
                        '✓ 所有内容全部解锁',
                        '✓ 优先支持'
                    ],
                    primary_cta: '💎 解锁高级版 - 9.99€',
                    secondary_cta: '明日再来（新增 3 次）',
                    footer: '💳 安全支付 • 即时访问 • 30 天保证'
                }
            },
            landing: {
                nav: {
                    why: '为何选择我们',
                    impact: '结果',
                    pricing: '定价',
                    cta: '免费试用'
                },
                hero: {
                    tag: '🚀 提升您的 Android 应用增长',
                    title: '借助实时 Play 商店数据，让营销决策更有把握。',
                    desc: 'PlayStore Analytics Pro 揭示市场信号：安装潜力、用户反馈、竞争对手与定位机会。',
                    primary: '免费试用（每日 3 次）',
                    secondary: '查看客户成果',
                    note: '无需信用卡 • 高级许可证 9.99€（一次性付款）'
                },
                metrics: [
                    '客户平均曝光度提升 42%',
                    '每个应用分析 65+ 指标',
                    '5 分钟内发现市场机会'
                ],
                benefits_title: '为何选择 PlayStore Analytics Pro？',
                benefits_subtitle: '为追求领先的营销团队量身打造的解决方案。',
                benefits: [
                    { title: '全面市场视角', desc: '即时深入分析任意应用。' },
                    { title: '快速决策', desc: '以影响力为导向的洞察帮您确定 ASO 优先级。' },
                    { title: '高级报告', desc: '生成可直接分享的精美报告。' },
                    { title: '高效协作', desc: '集中记录历史，确保团队共享同一套数据。' }
                ],
                impact_title: '成果显著',
                demo: {
                    title: '高级报告，随时分享。',
                    desc: '这正是您的客户或管理层将看到的内容：精美可视化、可执行的洞察、完整的数据故事。',
                    points: [
                        '20+ 页图表与建议',
                        '高级 PDF 模板，直接发送',
                        '可自定义章节：品牌、评论、后续行动'
                    ],
                    cards: [
                        { title: '增长曲线', desc: '逐周对比竞品安装量。' },
                        { title: '评分分布', desc: '1★-5★ 分布及流失预警。' },
                        { title: 'ASO 洞察', desc: '热门关键词与行动建议。' },
                        { title: '对比表格', desc: '体验、变现和功能对标。' }
                    ]
                },
                pricing_title: '适用于每个阶段的方案',
                pricing_subtitle: '免费起步，需要时解锁高级功能。',
                cta_banner: {
                    title: '准备好释放全部潜力了吗？',
                    desc: '免费开始或直接购买高级版 9.99€ — 一次性付款，终身无限分析。',
                    primary: '获取高级版（9.99€）',
                    secondary: '免费试用'
                },
                footer: {
                    dashboard: '控制台',
                    contact: '联系',
                    legal: '法律声明'
                }
            },
            pricing: {
                hero_tag: '为 ASO 团队打造的灵活方案',
                hero_title: '选择符合您增长阶段的 PlayStore Analytics Pro 方案。',
                hero_desc: '比较功能，一键激活高级许可证。',
                billing_monthly: '月付',
                billing_yearly: '年付',
                discount: '年付立减 20%',
                cards: [
                    { title: '基础版', tag: '入门首选', price: '0€', period: '/ 用户', cta: '免费试用' },
                    { title: '高级版', tag: '最受欢迎', price: '9.99€', period: '/ 报告', cta: '解锁高级版' },
                    { title: '团队版', tag: '适合大型团队', price: '定制', period: '', cta: '预约会议' }
                ],
                comparison_title: '功能对比',
                faq_title: '常见问题',
                contact_cta: '需要定制方案？'
            }
        }
    };

    const rtlLanguages = ['ar'];
    const storageKey = 'psa_lang';

    function getNestedValue(obj, path) {
        return path.split('.').reduce((acc, part) => (acc && part in acc ? acc[part] : undefined), obj);
    }

    function formatString(str, replacements) {
        if (!replacements) return str;
        return Object.keys(replacements).reduce(
            (acc, key) => acc.replace(new RegExp(`{${key}}`, 'g'), replacements[key]),
            str
        );
    }

    function applyTranslations(root = document, lang = getLanguage()) {
        const dict = translations[lang] || translations.fr;

        root.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const value = getNestedValue(dict, key);
            if (value !== undefined) {
                el.textContent = value;
            }
        });

        root.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            const value = getNestedValue(dict, key);
            if (value !== undefined) {
                el.innerHTML = value;
            }
        });

        root.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const value = getNestedValue(dict, key);
            if (value !== undefined) {
                el.setAttribute('placeholder', value);
            }
        });

        root.querySelectorAll('[data-i18n-value]').forEach(el => {
            const key = el.getAttribute('data-i18n-value');
            const value = getNestedValue(dict, key);
            if (value !== undefined) {
                el.value = value;
            }
        });

        root.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
            const key = el.getAttribute('data-i18n-aria-label');
            const value = getNestedValue(dict, key);
            if (value !== undefined) {
                el.setAttribute('aria-label', value);
            }
        });
    }

    function setLanguage(lang) {
        if (!translations[lang]) lang = 'fr';
        localStorage.setItem(storageKey, lang);
        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
        document.documentElement.dir = rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
        document.body.classList.toggle('rtl', rtlLanguages.includes(lang));
        applyTranslations(document, lang);
        window.dispatchEvent(new CustomEvent('i18n:languageChanged', { detail: { lang } }));
    }

    function getLanguage() {
        const stored = localStorage.getItem(storageKey);
        return stored && translations[stored] ? stored : 'fr';
    }

    function t(key, replacements) {
        const lang = getLanguage();
        const dict = translations[lang] || translations.fr;
        const value = getNestedValue(dict, key);
        if (typeof value === 'string') {
            return formatString(value, replacements);
        }
        // fallback to French
        const fallback = getNestedValue(translations.fr, key);
        if (typeof fallback === 'string') {
            return formatString(fallback, replacements);
        }
        return key;
    }

    window.i18n = {
        translations,
        applyTranslations,
        setLanguage,
        getLanguage,
        t
    };

    document.addEventListener('DOMContentLoaded', () => {
        const lang = getLanguage();
        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
        document.documentElement.dir = rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
        document.body.classList.toggle('rtl', rtlLanguages.includes(lang));
        applyTranslations(document, lang);
        window.dispatchEvent(new CustomEvent('i18n:languageChanged', { detail: { lang } }));
    });
})();
