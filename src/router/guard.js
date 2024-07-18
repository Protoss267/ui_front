//import { onBeforeRouteUpdate, onBeforeRouteLeave, onBeforeRouteEnter } from "vue-router";

const guard = (to,from,next)=>{
    const isAuthenticated = localStorage.getItem('jwtToken');

    if(to.meta.requiresAuth && !isAuthenticated)
    {
        next('/login')
    }
    else 
    next();
};
export default guard;