# service-app
node + ts 原生实现web服务应用

## 功能清单

- [x] 静态资源服务
  - [x] MIME 类型
  - [x] 404
  - [x] 配置缓存
    - [x] 强缓存
        - [x] expires
        - [x] cache-control
    - [x] 协商缓存
        - [x] Last-Modified
        - [x] Etag

- [ ] API服务
  - [ ] 处理POST请求
    - [x] application/x-www-form-urlencoded
    - [ ] multipart/form-data
    - [x] text/plain

- [x] 设置Cookie