import auth from "./auth";

export async function checkPermission() {
    
    const res = await auth.getUserLogged();
    
    let admin = res.data.data[0].isAdmin;
    console.log(admin);
    
    return admin ? true : false;
  }