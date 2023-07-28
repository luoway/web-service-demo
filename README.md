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

- [x] API服务
  
  - [x] 处理GET请求
  
  - [x] 处理POST请求
    - [x] application/x-www-form-urlencoded
    - [x] multipart/form-data
    - [x] text/plain
  
  - [x] 处理预检请求（OPTIONS）
  
      预检请求用于在实际请求发送前，客户端检测服务端是否实际允许该请求（如不允许跨域）。避免跨域请求对服务器的用户数据产生未预期的影响。

- [ ] 鉴权
  - [x] Basic