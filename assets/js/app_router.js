import Router from './core/router.js';


export function configure_router(app) {
	const router = new Router({
		mode: 'history',
		root: '/'
	});

	// Add routes
	router.add_route('/', app.render_dashboard.bind(app));
	router.add_route('/login', app.render_login.bind(app));
	router.add_route('/challenges', app.render_challenges.bind(app));
	router.add_route('/logs', app.render_logs.bind(app));
	router.add_route('/profile', app.render_profile.bind(app));
	router.add_route('/style-guide', app.render_style_guide.bind(app));

	return router;
}
