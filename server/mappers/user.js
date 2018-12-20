exports.Map = (dbUser) => {
  return {
    id: dbUser.Id,
    username: dbUser.Name,
    password: dbUser.Password,
    firstName: dbUser.FirstName,
    surName: dbUser.LastName,
    middleName: dbUser.MiddleName,
    image: dbUser.Avatar,
    permission: dbUser.Permission.Value,
    permissionId: dbUser.PermissionId
  }
};