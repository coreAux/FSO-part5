import React from "react"
import "@testing-library/jest-dom/extend-expect"
import { render, fireEvent } from "@testing-library/react"

import AddBlogForm from "./AddBlogForm"

describe("<AddBlogForm />", () => {
  let component

  const createBlog = jest.fn()

  beforeEach(() => {
    component = render(
      <AddBlogForm
        createBlog={createBlog}
        toastTime={() => null}
        setBlogs={() => null}
        blogFormRef={{ current: { toggleVisibility: () => jest.fn() } }}
      />
    )
  })

  test("(16) ", () => {
    const form = component.container.querySelector("form")
    const author = component.container.querySelector("#author")
    const title = component.container.querySelector("#title")
    const url = component.container.querySelector("#url")

    fireEvent.change(author, {
      target: { value: "Mickey" }
    })

    fireEvent.change(title, {
      target: { value: "Mickster Blog" }
    })

    fireEvent.change(url, {
      target: { value: "https://mikaelpetersen.se/" }
    })

    fireEvent.submit(form)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toStrictEqual({
      author: "Mickey",
      title: "Mickster Blog",
      url: "https://mikaelpetersen.se/"
    })
    // expect(component.container).toHaveTextContent("Author")
    // expect(component.container).toHaveTextContent("Title")
    // expect(component.container).not.toHaveTextContent("213")
    // expect(component.container).not.toHaveTextContent("http://url.of.blog/")
  })
})
