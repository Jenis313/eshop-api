module.exports = (userData, user) => {
    if(userData.name) 
        user.name = userData.name;
    if(userData.status)
        user.status = userData.status;
    if(userData.role)
        user.role = userData.role;
    if(userData.username)
        user.username = userData.username;
    if(userData.password)
        user.password = userData.password;
    if(userData.emailaddress)
        user.email = userData.emailaddress;
    if(userData.phoneNumber)
        user.phoneNumber = userData.phoneNumber;
    if(userData.dob)
        user.dob = userData.dob;
    if(userData.gender)
        user.gender = userData.gender;
    if(!user.address) 
        user.address = {};
    if(userData.tempAddress)
        user.address.temporaryAddress = typeof(userData.tempAddress) === 'string' ? userData.tempAddress.split(',') : userData.tempAddress
    if(userData.permanentAddress) 
        user.address.permanentAddress = userData.permanentAddress;
    if(userData.country) 
        user.country = userData.country;
    if(userData.image) 
    user.image = userData.image;
    if(userData.isArchived)
            user.isArchived = true;
    if(userData.setArchivedFalse) 
        user.isArchived = false;
    return user;
}