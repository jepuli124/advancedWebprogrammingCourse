const BookForm: React.FC = () => {
    
  const submitData = async (e: React.SyntheticEvent) => { //https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events/
    e.preventDefault()
    const form = new FormData(document.getElementById("bookForm") as HTMLFormElement)
    const jsonString = JSON.stringify({
      name: form.get("name"),
      author: form.get("author"),
      pages: form.get("pages")
    })
    console.log(jsonString)
    await fetch( '/api/book',{
      method: 'post',
      body: jsonString,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
  
  return (
    <>
      <h1>books</h1>
      <form id="bookForm" onSubmit={(e: React.SyntheticEvent) => submitData(e)}>
        <input type='text' id="name" name="name"></input>
        <input type='text' id="author" name="author"></input>
        <input type='number' id="pages" name="pages"></input>
        <input type='submit' id="submit" value="Submit" ></input>
      </form>
    </>                           
  )
}


export default BookForm