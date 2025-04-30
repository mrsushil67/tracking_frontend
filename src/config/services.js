const config = {
    host:import.meta.env.VITE_REACT_APP_BACKEND_URL,
    getAllVehicles:{
        url:'/api/v1/vehicle/allVehicles'
    },
    getVehiclePath:{
        url:'/api/v1/vehicle/vehiclePath'
    },
    filterVehiclePath:{
        url:'/api/v1/vehicle/filterPath'
    },
    currentLocation:{
        url:'/api/v1/vehicle/getVehicle'
    },
    getAllNotifications:{
        url:'/api/v1/notification/getAllNotifications'
    },
    markAllNotaficationAsRead:{
        url:'/api/v1/notification/updateNotification'
    },
}

export default config;