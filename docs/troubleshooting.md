# Troubleshooting

## Cannot read property '~run' of undefined

如果是 Valibot 发生的，并且经查是对应的 valueSchema 为 undefined，则大概率是因为：

- 循环引入导致的 Valibot Schema 创建错误
