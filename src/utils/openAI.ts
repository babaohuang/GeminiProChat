 从'@fuyun/generative-ai'导入{  GoogleGenerativeAI  }  

const  apiKey = ( import .meta .env .GEMINI_API_KEY ) _ _ _
const  apiBaseUrl = ( import .meta .env .API_BASE_URL ) ? . _ _ 修剪（）。替换( /\/$/ , '' )

const  genAI = apiBaseUrl
  ？新的GoogleGenerativeAI ( apiKey, apiBaseUrl )
  ：新的GoogleGenerativeAI ( apiKey )

导出 const  startChatAndSendMessageStream = async (历史记录: ChatMessage [ ] , newMessage : string ) => {
  常量 模型= genAI。getGenerativeModel ( { 模型: 'gemini-pro'  } )

  常量 聊天= 模型。开始聊天（{
    历史：历史。地图(味精=> ( {
      角色：消息。角色，
      部分：味精。部分。地图（部分=>部分.文本）。join ( '' ) , // 将各个部分连接成一个字符串
    } ) ) ,
     生成配置：{
    “温度”：0.95，
    “顶部_p”：1，
    “top_k”：1，
    “最大输出令牌”：2048，
    } ,
    安全设置：[
      {
          “类别”：“HARM_CATEGORY_HARASSMENT”，
          “阈值”：“BLOCK_NONE”
      } ,
      {
          “类别”：“HARM_CATEGORY_HATE_SPEECH”，
          “阈值”：“BLOCK_NONE”
      } ,
      {
          “类别”：“HARM_CATEGORY_SEXUALLY_EXPLICIT”，
          “阈值”：“BLOCK_NONE”
      } ,
      {
          “类别”：“HARM_CATEGORY_DANGEROUS_CONTENT”，
          “阈值”：“BLOCK_NONE”
      }
  ] ,
  } )

  // 使用 sendMessageStream 来传输响应
  const 结果=等待聊天。发送消息流（新消息）

  const 编码流=新的ReadableStream ( {
    异步 启动（控制器） {
      const 编码器= new TextEncoder ( )
      for  await  ( const  chunk  of result.stream ) { _ 
        const  text =等待块。文本（）
        const 编码= 编码器。编码（文本）
        控制器。入队（编码）
      }
      控制器。关闭（）
    } ,
  } )

  返回编码流
}
