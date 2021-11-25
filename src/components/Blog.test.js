import React from "react"
import "@testing-library/jest-dom/extend-expect"
import { render, fireEvent } from "@testing-library/react"

import Blog from "./Blog"

describe("<Blog />", () => {
  let component

  const mockHandler = jest.fn()

  beforeEach(() => {
    const blog = {
      author: "Author",
      id: "619b944220b8a5062a6ec567",
      likes: 213,
      title: "Title",
      url: "http://url.of.blog/",
      user: {
        username: "Mickster",
        name: "MaMickster",
        id: "61956424d875b80aa7f63da9",
      },
    }

    component = render(
      <Blog
        addLike={mockHandler}
        toastTime={() => null}
        removeBlog={() => null}
        setBlogs={() => null}
        user={blog.user}
        blog={blog}
      />
    )
  })

  test("(13) title and author is rendered but not url or likes", () => {
    expect(component.container).toHaveTextContent("Author")
    expect(component.container).toHaveTextContent("Title")
    expect(component.container).not.toHaveTextContent("213")
    expect(component.container).not.toHaveTextContent("http://url.of.blog/")
  })

  test("(14) url and likes are shown when button has been clicked", () => {
    const showButton = component.getByText("Show")
    fireEvent.click(showButton)

    expect(component.container).toHaveTextContent("Author")
    expect(component.container).toHaveTextContent("Title")
    expect(component.container).toHaveTextContent("213")
    expect(component.container).toHaveTextContent("http://url.of.blog/")
  })

  test("(15) if like button is clicked twice event is called twice", () => {
    const showButton = component.getByText("Show")
    fireEvent.click(showButton)

    const likeButton = component.getByText("Like")
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
