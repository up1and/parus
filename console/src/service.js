import axios from 'axios'

const http = axios.create({
  baseURL: '/api',
  headers: {
    'Content-type': 'application/json',
    Authorization: `Bearer ${sessionStorage.access_token}`,
  },
})

class PostService {
  _paramsEncode(count, p, draft) {
    let text = `limit=${count}&offset=${p ? p * count : 0}`
    text = draft ? `draft=true&` + text : text
    return text
  }

  all(page, limit = 10, draft = false) {
    return http.get(`/posts?${this._paramsEncode(limit, page, draft)}`)
  }

  byAuthor(username, page, limit = 5) {
    return http.get(
      `/posts/author/${username}?${this._paramsEncode(limit, page)}`
    )
  }

  byMeta(meta, page, limit = 10) {
    return http.get(`/posts/meta/${meta}?${this._paramsEncode(limit, page)}`)
  }

  get(id) {
    return http.get(`/posts/${id}`)
  }

  create(data) {
    return http.post('/posts', data)
  }

  update(id, data) {
    return http.put(`/posts/${id}`, data)
  }

  destory(id) {
    return http.delete(`/posts/${id}`)
  }
}

class PageService {
  all() {
    return http.get('/pages')
  }

  get(id) {
    return http.get(`/pages/${id}`)
  }

  create(data) {
    return http.post('/pages', data)
  }

  update(id, data) {
    return http.put(`/pages/${id}`, data)
  }

  destory(id) {
    return http.delete(`/pages/${id}`)
  }
}

class MetaService {
  all() {
    return http.get('/metas')
  }

  get(id) {
    return http.get(`/metas/${id}`)
  }

  create(data) {
    return http.post('/metas', data)
  }

  update(id, data) {
    return http.put(`/metas/${id}`, data)
  }

  destory(id) {
    return http.delete(`/metas/${id}`)
  }
}

const postService = new PostService()
const pageService = new PageService()
const metaService = new MetaService()

export { postService, pageService, metaService }
