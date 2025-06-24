import { createRouter, createWebHistory } from 'vue-router';

import wwPage from './views/wwPage.vue';

import { initializeData, initializePlugins, onPageUnload } from '@/_common/helpers/data';

let router;
const routes = [];

function scrollBehavior(to) {
    if (to.hash) {
        return {
            el: to.hash,
            behavior: 'smooth',
        };
    } else {
        return { top: 0 };
    }
}

 
/* wwFront:start */
import pluginsSettings from '../../plugins-settings.json';

// eslint-disable-next-line no-undef
window.wwg_designInfo = {"id":"804c5067-58c6-49d7-bd6d-d53fba238b2e","homePageId":"1c7a2cc3-37f3-40e6-afa1-1d4f5b9d2a60","authPluginId":null,"baseTag":null,"defaultTheme":"light","langs":[{"lang":"en","default":true}],"background":{},"workflows":[{"id":"35074879-4926-4fa7-a1db-935ba42d81dd","actions":{},"trigger":"onload-app"}],"pages":[{"id":"d94fff81-4d44-4e38-82f7-35af9ac08c0f","linkId":"d94fff81-4d44-4e38-82f7-35af9ac08c0f","name":"Dashboard","folder":"Dashboard/","paths":{"en":"dashboard","default":"dashboard"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"531d164c-f422-40c1-b9d7-8660e4402ad0","sectionTitle":"Section","linkId":"11fdf343-1a24-4691-a491-896aaf47bf4f"},{"uid":"c55ab3ee-a146-4074-a040-fb575091f771","sectionTitle":"Sidebar Navigation","linkId":"136cdec4-8222-4ef6-aed6-87e4a2d68d42"},{"uid":"d3a12104-8a2f-47aa-a4d9-00c203d7a11e","sectionTitle":"Main Content Section","linkId":"e339afb0-3984-4e42-84d2-cde1ad71ec20"}],"pageUserGroups":[],"title":{"en":"Car Rental Dashboard"},"meta":{"desc":{"en":"Dashboard for managing vehicles, bookings, customers, and revenue with charts and filters."},"keywords":{"en":"car rental, dashboard, vehicles, bookings, customers, revenue, charts, filters"},"socialDesc":{"en":"Manage your car rental business with dynamic data, charts, and filters."},"socialTitle":{"en":"Car Rental SaaS Dashboard"}},"metaImage":""},{"id":"23538c8f-a593-4513-9cb8-df810fca71fb","linkId":"23538c8f-a593-4513-9cb8-df810fca71fb","name":"Vehicles","folder":"Dashboard/","paths":{"en":"vehicles","default":"vehicles"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"c55ab3ee-a146-4074-a040-fb575091f771","sectionTitle":"Sidebar Navigation","linkId":"136cdec4-8222-4ef6-aed6-87e4a2d68d42"},{"uid":"eadf0fd5-9c56-4592-8ec6-4740c659b3b0","sectionTitle":"Main Content Section","linkId":"67cd0651-e188-43aa-ba3e-e45c7ea40f7a"},{"uid":"dce6d8c0-b0a2-4492-a294-9d08edb959a9","sectionTitle":"Main Content Section","linkId":"5558ca54-41e0-41ee-b5da-a51bce2bdc52"}],"pageUserGroups":[],"title":{"en":"Vehicles Management"},"meta":{"desc":{"en":"Manage and view the list of vehicles available for rent."},"keywords":{"en":"vehicles, car rental, management"},"socialDesc":{"en":"Manage your car rental vehicles with ease."},"socialTitle":{"en":"Vehicles Management"}},"metaImage":""},{"id":"3e61ec52-2b19-4f25-a80d-8ee645076c8d","linkId":"3e61ec52-2b19-4f25-a80d-8ee645076c8d","name":"Customers","folder":"Dashboard/","paths":{"en":"customers","default":"customers"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"c55ab3ee-a146-4074-a040-fb575091f771","sectionTitle":"Sidebar Navigation","linkId":"136cdec4-8222-4ef6-aed6-87e4a2d68d42"},{"uid":"ce01391a-be1d-4605-baaf-cc6552a839c2","sectionTitle":"Main Content Section","linkId":"0b6ca305-8452-48a1-80ea-edf1affa40c4"}],"pageUserGroups":[],"title":{"en":"Customers Management"},"meta":{"desc":{"en":"Manage customer profiles and data for the car rental service."},"keywords":{"en":"customers, car rental, management"},"socialDesc":{"en":"Manage your car rental customers."},"socialTitle":{"en":"Customers Management"}},"metaImage":""},{"id":"93f7eabf-5287-4ea6-86df-e3aa5b43c25c","linkId":"93f7eabf-5287-4ea6-86df-e3aa5b43c25c","name":"Bookings","folder":"Dashboard/","paths":{"en":"bookings","default":"bookings"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"c55ab3ee-a146-4074-a040-fb575091f771","sectionTitle":"Sidebar Navigation","linkId":"136cdec4-8222-4ef6-aed6-87e4a2d68d42"},{"uid":"3097dbfd-60ed-4eca-a807-2a32a9acbc9f","sectionTitle":"Main Content","linkId":"87c5d23c-cc89-44be-bb98-c807b396086f"}],"pageUserGroups":[],"title":{"en":"Bookings Management"},"meta":{"desc":{"en":"View and manage all bookings with filters and status updates."},"keywords":{"en":"bookings, car rental, management"},"socialDesc":{"en":"Manage car rental bookings efficiently."},"socialTitle":{"en":"Bookings Management"}},"metaImage":""},{"id":"85180a83-8240-457c-8d5d-48ed744e1bd5","linkId":"85180a83-8240-457c-8d5d-48ed744e1bd5","name":"CampaignBuilder","folder":"Dashboard/","paths":{"en":"campaign-builder","default":"campaign-builder"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"c55ab3ee-a146-4074-a040-fb575091f771","sectionTitle":"Sidebar Navigation","linkId":"136cdec4-8222-4ef6-aed6-87e4a2d68d42"},{"uid":"2c5b0252-5576-465e-8d25-db969cd1c092","sectionTitle":"Main Content Section","linkId":"6277e7ae-1f15-4da2-ac00-41c49fdbf3da"}],"pageUserGroups":[],"title":{"en":"Campaign Builder"},"meta":{"desc":{"en":"Create marketing campaigns powered by OpenAI for the car rental SaaS."},"keywords":{"en":"campaign builder, marketing, OpenAI, car rental"},"socialDesc":{"en":"Build marketing campaigns using AI for your car rental business."},"socialTitle":{"en":"Campaign Builder"}},"metaImage":""},{"id":"1c7a2cc3-37f3-40e6-afa1-1d4f5b9d2a60","linkId":"1c7a2cc3-37f3-40e6-afa1-1d4f5b9d2a60","name":"Home","folder":null,"paths":{"en":"home","default":"home"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"a3ddb83b-1109-4c52-b912-91f596e26c7d","sectionTitle":"Main Container","linkId":"1994a777-99f5-4deb-87f1-efaef9048db2"}],"pageUserGroups":[],"title":{"en":"","fr":"Vide | Commencer à partir de zéro"},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":""},{"id":"fb836856-6baa-439d-94c2-1cf9b6a322b3","linkId":"fb836856-6baa-439d-94c2-1cf9b6a322b3","name":"ai marketing","folder":"Dashboard/messages/","paths":{"en":"ai-marketing","default":"ai-marketing"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"94f9aae9-9b00-48bb-91a9-e43b824aaa1b","sectionTitle":"Main Container","linkId":"a7d55b01-b225-40a5-930d-961c662f6c4f"}],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":""},{"id":"a3ee33ea-04b7-42ab-bdb0-d5ca4aa22249","linkId":"a3ee33ea-04b7-42ab-bdb0-d5ca4aa22249","name":"live tracking","folder":null,"paths":{"en":"live-tracking","default":"live-tracking"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"5f48b86c-ff04-4cb8-9b8c-d1db3922ab41","sectionTitle":"Navbar Section","linkId":"88481958-1473-46d7-9ad7-aace69749acd"},{"uid":"297510fd-84c0-4d07-a109-e303ebccda3e","sectionTitle":"Main Section","linkId":"46a14d80-894e-4a93-ae2e-9a2176be425c"}],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":""},{"id":"a4dc404c-b142-40ec-8152-5e728857b8a7","linkId":"a4dc404c-b142-40ec-8152-5e728857b8a7","name":"settings","folder":"Dashboard/","paths":{"en":"settings","default":"settings"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"12262c6f-1820-4963-9c35-54b3816cedb1","sectionTitle":"Sidebar Section","linkId":"ef272032-ea2c-47d4-8270-2f69f521c97e"},{"uid":"3b01e696-d385-4c68-b4c7-5f3bca2569ca","sectionTitle":"Main Content Section","linkId":"aff3094d-e9d6-4474-a741-8e3341ff0934"}],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":""},{"id":"ccbe2dc0-9693-4a0d-a917-ea9b99c75202","linkId":"ccbe2dc0-9693-4a0d-a917-ea9b99c75202","name":"Revenue","folder":"Dashboard/","paths":{"en":"revenue","default":"revenue"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"c55ab3ee-a146-4074-a040-fb575091f771","sectionTitle":"Sidebar Navigation","linkId":"136cdec4-8222-4ef6-aed6-87e4a2d68d42"},{"uid":"68fa963f-709f-4d67-bcb9-4da0ac176770","sectionTitle":"Main Content Section","linkId":"79f7b5a3-da41-4094-8b0b-eb76524813c5"}],"pageUserGroups":[],"title":{"en":"Revenue Analytics"},"meta":{"desc":{"en":"View revenue data with charts and filters for the car rental business."},"keywords":{"en":"revenue, analytics, car rental"},"socialDesc":{"en":"Analyze your car rental revenue with charts and filters."},"socialTitle":{"en":"Revenue Analytics"}},"metaImage":""},{"id":"e7908dfb-ba55-47cb-b057-a723ad57d746","linkId":"e7908dfb-ba55-47cb-b057-a723ad57d746","name":"loginpage","folder":"Dashboard/","paths":{"en":"loginpage","default":"loginpage"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"35243ca2-2069-416e-9a39-c161104ef34a","sectionTitle":"Main Container","linkId":"c932bfd2-c6f9-46c9-9515-d07b4cde7ccc"}],"pageUserGroups":[],"title":{"en":"","fr":"Vide | Commencer à partir de zéro"},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":""},{"id":"7cc99cfa-e3a2-4bca-b6ba-c6d34f0fc357","linkId":"7cc99cfa-e3a2-4bca-b6ba-c6d34f0fc357","name":"livetracking","folder":null,"paths":{"en":"livetracking","default":"livetracking"},"langs":["en"],"cmsDataSetPath":null,"sections":[],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":""},{"id":"0376bed7-395d-4bb0-a8ef-4eafd3cebdb4","linkId":"0376bed7-395d-4bb0-a8ef-4eafd3cebdb4","name":"vecletrck","folder":null,"paths":{"en":"vecletrck","default":"vecletrck"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"c55ab3ee-a146-4074-a040-fb575091f771","sectionTitle":"Sidebar Navigation","linkId":"136cdec4-8222-4ef6-aed6-87e4a2d68d42"}],"pageUserGroups":[],"title":{"en":"Car Rental Dashboard"},"meta":{"desc":{"en":"Dashboard for managing vehicles, bookings, customers, and revenue with charts and filters."},"keywords":{"en":"car rental, dashboard, vehicles, bookings, customers, revenue, charts, filters"},"socialDesc":{"en":"Manage your car rental business with dynamic data, charts, and filters."},"socialTitle":{"en":"Car Rental SaaS Dashboard"}},"metaImage":""},{"id":"c372751b-fa0d-401b-8b24-13feb4fb91d1","linkId":"c372751b-fa0d-401b-8b24-13feb4fb91d1","name":"forlivetracking","folder":null,"paths":{"en":"forlivetracking","default":"forlivetracking"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"6167bbcc-f4bf-4a47-b917-3f72f8d288d3","sectionTitle":"Navigation Bar","linkId":"c014a5c5-1af3-4fbb-9e15-98b9018d9770"},{"uid":"e36f11c0-1832-455b-8096-90fa55dd02aa","sectionTitle":"Main Content Section","linkId":"69bd9a24-04b5-4b94-92a2-d9ef7c946b44"}],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":""},{"id":"2ef9d9a5-832c-4c25-a24e-1df5d01dec05","linkId":"2ef9d9a5-832c-4c25-a24e-1df5d01dec05","name":"message new","folder":"Dashboard/","paths":{"en":"message-new","default":"message-new"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"4e5b4998-38f2-42cb-9c40-ab4cea924d3e","sectionTitle":"Navbar Section","linkId":"b6a9a31e-739c-4687-ad2c-87be3899ba21"},{"uid":"2f1c035d-d138-4a73-8454-4ef360b5a73c","sectionTitle":"Main Section","linkId":"334e2f07-a289-4a28-b9b1-7b46cdad58bf"}],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":""},{"id":"c6ff85ee-fe0f-4209-a387-2e6eff386864","linkId":"c6ff85ee-fe0f-4209-a387-2e6eff386864","name":"Message","folder":null,"paths":{"en":"message","default":"message"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"2cbe34a7-0430-4e18-aa8c-702d591d6ffb","sectionTitle":"Navigation Bar Section","linkId":"bc845e5d-c14c-426a-97b7-47e99863ba66"},{"uid":"2392c02c-893e-4baa-8c4c-22698ffd904f","sectionTitle":"Main Content Section","linkId":"e173a4ac-4616-4248-b374-b23946e83559"}],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":""},{"id":"9b7953fd-3919-44f4-9a3d-6888e6499228","linkId":"9b7953fd-3919-44f4-9a3d-6888e6499228","name":"vehiclelivetracking","folder":"Dashboard/","paths":{"en":"vehiclelivetracking","default":"vehiclelivetracking"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"d13958dc-c1ab-4d63-8a94-7736f8ed9aa1","sectionTitle":"Header Section","linkId":"48b7d915-9ab7-4ef9-bf22-b7d3c663b8f2"},{"uid":"9dd7bad2-be21-41e4-a7c2-7064cf51eeb1","sectionTitle":"Vehicles Section","linkId":"c3a7e845-b1e4-439b-a208-9d4eef64370e"}],"pageUserGroups":[],"title":{},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":""}],"plugins":[{"id":"2bd1c688-31c5-443e-ae25-59aa5b6431fb","name":"REST API","namespace":"restApi"},{"id":"cd33cf33-e29f-4e8c-ac26-b997fe507ce7","name":"Xano","namespace":"xano"}]};
// eslint-disable-next-line no-undef
window.wwg_cacheVersion = 13;
// eslint-disable-next-line no-undef
window.wwg_pluginsSettings = pluginsSettings;
// eslint-disable-next-line no-undef
window.wwg_disableManifest = false;

const defaultLang = window.wwg_designInfo.langs.find(({ default: isDefault }) => isDefault) || {};

const registerRoute = (page, lang, forcedPath) => {
    const langSlug = !lang.default || lang.isDefaultPath ? `/${lang.lang}` : '';
    let path =
        forcedPath ||
        (page.id === window.wwg_designInfo.homePageId ? '/' : `/${page.paths[lang.lang] || page.paths.default}`);

    //Replace params
    path = path.replace(/{{([\w]+)\|([^/]+)?}}/g, ':$1');

    routes.push({
        path: langSlug + path,
        component: wwPage,
        name: `page-${page.id}-${lang.lang}`,
        meta: {
            pageId: page.id,
            lang,
            isPrivate: !!page.pageUserGroups?.length,
        },
        async beforeEnter(to, from) {
            if (to.name === from.name) return;
            //Set page lang
            wwLib.wwLang.defaultLang = defaultLang.lang;
            wwLib.$store.dispatch('front/setLang', lang.lang);

            //Init plugins
            await initializePlugins();

            //Check if private page
            if (page.pageUserGroups?.length) {
                // cancel navigation if no plugin
                if (!wwLib.wwAuth.plugin) {
                    return false;
                }

                await wwLib.wwAuth.init();

                // Redirect to not sign in page if not logged
                if (!wwLib.wwAuth.getIsAuthenticated()) {
                    window.location.href = `${wwLib.wwPageHelper.getPagePath(
                        wwLib.wwAuth.getUnauthenticatedPageId()
                    )}?_source=${to.path}`;

                    return null;
                }

                //Check roles are required
                if (
                    page.pageUserGroups.length > 1 &&
                    !wwLib.wwAuth.matchUserGroups(page.pageUserGroups.map(({ userGroup }) => userGroup))
                ) {
                    window.location.href = `${wwLib.wwPageHelper.getPagePath(
                        wwLib.wwAuth.getUnauthorizedPageId()
                    )}?_source=${to.path}`;

                    return null;
                }
            }

            try {
                await import(`@/pages/${page.id.split('_')[0]}.js`);
                await wwLib.wwWebsiteData.fetchPage(page.id);

                //Scroll to section or on top after page change
                if (to.hash) {
                    const targetElement = document.getElementById(to.hash.replace('#', ''));
                    if (targetElement) targetElement.scrollIntoView();
                } else {
                    document.body.scrollTop = document.documentElement.scrollTop = 0;
                }

                return;
            } catch (err) {
                wwLib.$store.dispatch('front/showPageLoadProgress', false);

                if (err.redirectUrl) {
                    return { path: err.redirectUrl || '404' };
                } else {
                    //Any other error: go to target page using window.location
                    window.location = to.fullPath;
                }
            }
        },
    });
};

for (const page of window.wwg_designInfo.pages) {
    for (const lang of window.wwg_designInfo.langs) {
        if (!page.langs.includes(lang.lang)) continue;
        registerRoute(page, lang);
    }
}

const page404 = window.wwg_designInfo.pages.find(page => page.paths.default === '404');
if (page404) {
    for (const lang of window.wwg_designInfo.langs) {
        // Create routes /:lang/:pathMatch(.*)* etc for all langs of the 404 page
        if (!page404.langs.includes(lang.lang)) continue;
        registerRoute(
            page404,
            {
                default: false,
                lang: lang.lang,
            },
            '/:pathMatch(.*)*'
        );
    }
    // Create route /:pathMatch(.*)* using default project lang
    registerRoute(page404, { default: true, isDefaultPath: false, lang: defaultLang.lang }, '/:pathMatch(.*)*');
} else {
    routes.push({
        path: '/:pathMatch(.*)*',
        async beforeEnter() {
            window.location.href = '/404';
        },
    });
}

let routerOptions = {};

const isProd =
    !window.location.host.includes(
        // TODO: add staging2 ?
        '-staging.' + (process.env.WW_ENV === 'staging' ? import.meta.env.VITE_APP_PREVIEW_URL : '')
    ) && !window.location.host.includes(import.meta.env.VITE_APP_PREVIEW_URL);

if (isProd && window.wwg_designInfo.baseTag?.href) {
    let baseTag = window.wwg_designInfo.baseTag.href;
    if (!baseTag.startsWith('/')) {
        baseTag = '/' + baseTag;
    }
    if (!baseTag.endsWith('/')) {
        baseTag += '/';
    }

    routerOptions = {
        base: baseTag,
        history: createWebHistory(baseTag),
        routes,
    };
} else {
    routerOptions = {
        history: createWebHistory(),
        routes,
    };
}

router = createRouter({
    ...routerOptions,
    scrollBehavior,
});

//Trigger on page unload
let isFirstNavigation = true;
router.beforeEach(async (to, from) => {
    if (to.name === from.name) return;
    if (!isFirstNavigation) await onPageUnload();
    isFirstNavigation = false;
    wwLib.globalVariables._navigationId++;
    return;
});

//Init page
router.afterEach((to, from, failure) => {
    wwLib.$store.dispatch('front/showPageLoadProgress', false);
    let fromPath = from.path;
    let toPath = to.path;
    if (!fromPath.endsWith('/')) fromPath = fromPath + '/';
    if (!toPath.endsWith('/')) toPath = toPath + '/';
    if (failure || (from.name && toPath === fromPath)) return;
    initializeData(to);
});
/* wwFront:end */

export default router;
