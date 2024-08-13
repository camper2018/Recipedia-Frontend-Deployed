const logout = () => {
    try {
        localStorage.clear();
      } catch (error) {
        console.error("Error removing item from local storage:", error);
      }
}
export default logout;