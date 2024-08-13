/********* Local Storage functions **********/
const getFavoritesFromStore = () => {
    const myFavorites = localStorage.getItem("favorites") ? JSON.parse(localStorage.getItem("favorites")) : [];
    return myFavorites;
}
const addFavoritesToStore = (recipe) => {
    const myFavorites = getFavoritesFromStore();
    myFavorites.push(recipe);
    localStorage.setItem("favorites", JSON.stringify(myFavorites));
}
const checkFavoritesStore = (id) => {
    const myFavorites = getFavoritesFromStore();
    const isFavorite = myFavorites.some(recipe => recipe.id === id);
    return isFavorite;
};
const removeFavoritesFromStore = (updatedFavorites) => {
   localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
}
const getSavedListsFromStore = ()=> {
    const savedLists = localStorage.getItem("myLists")? JSON.parse(localStorage.getItem("myLists")): [];
    return savedLists;
}
const saveListToStore = (list)=> {
    const myLists = getSavedListsFromStore();
    myLists.push(list);
    localStorage.setItem('myLists', JSON.stringify(myLists));   
}
const deleteListFromStore = (title) => {
    const savedLists = getSavedListsFromStore();
    const filteredLists = savedLists.filter(list => list.title !== title);
    localStorage.setItem("myLists", JSON.stringify(filteredLists));
    return filteredLists;
};
const getJwt = () => {
   return localStorage.getItem('recipediajwt');
}
const setJwt = (val)=> {
    localStorage.setItem('recipediajwt', val);
}
const getUser = () => {
    return localStorage.getItem("user");
}
const setUser = (val) => {
    if (val)
    localStorage.setItem('user', val);
}
const getImage = ()=> {
    return localStorage.getItem("profile-picture");
}
const saveImage = (val) => {
  localStorage.setItem("profile-picture", val);
}
export default {
    getFavoritesFromStore,
    addFavoritesToStore,
    checkFavoritesStore,
    removeFavoritesFromStore,
    getSavedListsFromStore,
    deleteListFromStore,
    saveListToStore,
    getJwt,
    setJwt,
    getUser,
    setUser,
    getImage,
    saveImage
}