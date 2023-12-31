 从'@fuyun/generative-ai'导入{  GoogleGenerativeAI  }  

const  apiKey  =  ( import .meta .env .GEMINI_API_KEY ) _ _ _
const  apiBaseUrl  =  ( import .meta .env .API_BASE_URL ) ? . _ _ 修剪（）。替换( / \/ $ / , '' ) 

const  genAI  =  apiBaseUrl
  ？新的 GoogleGenerativeAI ( apiKey ,  apiBaseUrl )
  ：新的 GoogleGenerativeAI ( apiKey )

导出 const  startChatAndSendMessageStream  =  async (历史记录: ChatMessage [ ] ,  newMessage : string )  =>  {
  常量 模型 =  genAI 。getGenerativeModel ( { 模型: 'gemini-pro'  } )

  常量 聊天 = 模型。开始聊天（{
    历史：历史。地图(味精 =>  ( {
      作用：味精。角色，
      部分：味精。部分。地图（部分 => 部分.文本）。join ( '' ) ,  // 将各个部分连接成一个字符串
    } ) ) ,
    生成配置：{
      最大输出令牌：8000 ，
    } ,
  } )

  // 使用 sendMessageStream 来传输响应
  const 结果 = 等待 聊天。发送消息流（新消息）

  const 编码流 = 新的 ReadableStream ( {
    异步 启动（控制器） {
      const 编码器 =  new  TextEncoder ( )
      for等待（结果的常量块.stream）{_for  await  ( const  chunk  of  result .stream ) { _ 
        const text = 等待块。文本（）const  text  = 等待 块。文本（）
        常量编码 = 编码器。编码（文本）
        控制器。入队（编码）
      }}
      控制器。关闭（）
    } ,} ,
  } )} )

  返回编码流
