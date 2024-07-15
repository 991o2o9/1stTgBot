require('dotenv').config()
const {
	Bot,
	GrammyError,
	HttpError,
	Keyboard,
	InlineKeyboard,
} = require('grammy')
const { hydrate } = require('@grammyjs/hydrate')

const bot = new Bot(process.env.BOT_API_KEY)
bot.use(hydrate())

bot.api.setMyCommands([
	{
		command: 'start',
		description: 'Запуск бота',
	},
	{
		command: 'mood',
		description: 'Как у вас дела?',
	},
	// {
	// 	command: 'share',
	// 	description: 'Чем хотите поделиться?',
	// },
	// {
	// 	command: 'inline_keyboard',
	// 	description: 'inline keyboard',
	// },
	{
		command: 'menu',
		description: 'Получить меню',
	},
])

const menuKeyboard = new InlineKeyboard()
	.text('Узнать статус заказа', 'order-status')
	.text('Обратиться в поддержку', 'support')
const backKeyboard = new InlineKeyboard().text('< Назад в меню', 'back')
bot.command('menu', async ctx => {
	await ctx.reply('Выберите пункты меню', {
		reply_markup: menuKeyboard,
	})
})

bot.callbackQuery('order-status', async ctx => {
	await ctx.callbackQuery.message.editText('Статус заказа: пути', {
		reply_markup: backKeyboard,
	})
	await ctx.answerCallbackQuery()
})
bot.callbackQuery('support', async ctx => {
	await ctx.callbackQuery.message.editText('Напишите ваш запрос', {
		reply_markup: backKeyboard,
	})
	await ctx.answerCallbackQuery()
})
bot.callbackQuery('back', async ctx => {
	await ctx.callbackQuery.message.editText('Выберите пункты меню', {
		reply_markup: menuKeyboard,
	})
	await ctx.answerCallbackQuery()
})

// bot.command('start', async ctx => {
// 	await ctx.reply('Привет я бот', {
// 		reply_parameters: { message_id: ctx.msg.message_id },
// 	})
// })
bot.command('start', async ctx => {
	await ctx.react('👍')
	await ctx.reply(
		'Привет я бот. Тг канал : <a href="https://www.youtube.com/watch?v=q-AFR0D7Vuw">Ссылка</a> ',
		{
			parse_mode: 'HTML',
		}
	)
})

bot.command('mood', async ctx => {
	const moodKeyboard = new Keyboard()
		.text('Хорошо')
		.row()
		.text('Норм')
		.row()
		.text('Плохо')
		.row()
		.resized()
	await ctx.reply('Как настроение', {
		reply_markup: moodKeyboard,
	})
})

bot.hears('Хорошо', async ctx => {
	await ctx.reply('Круто! Рад что вам хорошо', {
		reply_markup: { remove_keyboard: true },
	})
})
bot.hears('Норм', async ctx => {
	await ctx.reply('Возможно вы устали, вас стоит отдохнуть!', {
		reply_markup: { remove_keyboard: true },
	})
})
bot.hears('Плохо', async ctx => {
	await ctx.reply(
		'А что случилось? вот вам песня для спокойствия: Надесь эта [песня](https://www.youtube.com/watch?v=7RWbq-lbBlk&list=RD7RWbq-lbBlk&start_radio=1), сможет вас успокоить',
		{
			parse_mode: 'MarkdownV2',
			disable_web_page_preview: true,
		}
	)
})

bot.command('help', async ctx => {
	await ctx.reply('Чем я могу вам помочь?')
})

bot.command(['say_hello', 'hello', 'say_hi'], async ctx => {
	await ctx.reply('Hello!')
})

bot.command('age', async ctx => {
	const moodLabels = ['Я младше 18 лет', 'Я старше 18 лет', 'Мне больше 50 лет']
	const rows = moodLabels.map(label => {
		return [Keyboard.text(label)]
	})
	const moodKeyboard2 = Keyboard.from(rows).resized()
	await ctx.reply('Сколько вам лет?', {
		reply_markup: moodKeyboard2,
	})
})

bot.hears('Я младше 18 лет', async ctx => {
	await ctx.reply('Блять ты какого хуя тут забыл, младенец', {
		reply_markup: { remove_keyboard: true },
	})
})

bot.command('share', async ctx => {
	const shareKeyboard = new Keyboard()
		.requestLocation('Геолокация')
		.requestContact('Контакт')
		.requestPoll('Опрос')
		.placeholder('Ваши данные')
		.resized()
	await ctx.reply('Чем хотите поделиться?', {
		reply_markup: shareKeyboard,
	})
})

bot.on(':contact', async ctx => {
	await ctx.reply('Спасибо за ваши контакты')
})

bot.command('inline_keyboard', async ctx => {
	const keyboard = new InlineKeyboard()
		.text('1', 'button-1')
		.row()
		.text('2', 'button-2')
		.row()
		.text('3', 'button-3')
	// const keyboard2 = new InlineKeyboard().url(
	// 	'Перейти по ссылке',
	// 	'https://www.youtube.com/watch?v=q-AFR0D7Vuw'
	// )
	// await ctx.reply('Нажмите кнопку', {
	// 	reply_markup: keyboard2,
	// })
	await ctx.reply('Выберите цифру', {
		reply_markup: keyboard,
	})
})

// bot.callbackQuery(['button-1', 'button-2', 'button-3'], async ctx => {
// 	await ctx.answerCallbackQuery('Вы выбрали цифру')
// 	await ctx.reply('Вы выбрали цифру')
// })

bot.callbackQuery(/button-[1-3]/, async ctx => {
	await ctx.answerCallbackQuery()
	await ctx.reply(`Вы нажали кнопку ${ctx.callbackQuery.data} `)
})

// bot.on('callback_query:data', async ctx => {
// 	await ctx.answerCallbackQuery()
// 	await ctx.reply(`Вы нажали кнопку ${ctx.callbackQuery.data} `)
// })

// bot.on('::url', async ctx => {
// 	await ctx.reply('Я получил ссылку')
// })
// bot.on('message:photo', async ctx => {
// 	await ctx.reply('нах мне твоя ебанное, грязное лицо')
// })

// bot.on('photo').on('::hashtag', async ctx => {
// 	await ctx.reply(
// 		'нах мне твоя ебанное, грязное лицо, блять ты либо даун, либо аутист нахуя мне нужен твой хештег'
// 	)
// })

// bot.on('msg').filter(
// 	ctx => {
// 		return (ctx.from.id = 255162448)
// 	},
// 	async ctx => {
// 		await ctx.reply('Привет, админ')
// 	}
// )

// bot.hears(['уно', 'дос', 'трес'], async ctx => {
// 	const text = ctx.message.text
// 	if (text === 'уно') {
// 		await ctx.reply('дос трес')
// 	} else if (text === 'дос') {
// 		await ctx.reply('трес ma boy')
// 	} else if (text === 'трес') {
// 		await ctx.reply(
// 			'What the hell bro. Why did you decide to start from the end?'
// 		)
// 	}
// })

bot.hears(/бля|сука|пизда|хуй|умри|kys|еблан/, async ctx => {
	await ctx.reply(
		'Ахх ты маленький пидорас... материшься? Я все это твоей маме скину'
	)
})

// bot.on('msg', async ctx => {
// 	console.log(ctx.from)
// })

// bot.hears('ID', async ctx => {
// 	await ctx.reply(`Ваш ID: ${ctx.from.id}`)
// })

// как показал выше, можно делать свои кастомные фильтры

// есть огромное количество фильтров, которые можно узнать перейдя по ссылке.

// некоторые фильтры можно комбинировать, засунуть массив, который будет играть роль "или", так же есть список сокращений например: место того чтобы писать message:photo можно просто :photo и так далее

bot.catch(err => {
	const ctx = err.ctx
	console.error(`Error while handling update ${ctx.update.update_id}:`)
	const e = err.error

	if (e instanceof GrammyError) {
		console.error('Error in request:', e.description)
	} else {
		console.error('Unknown error:', e)
	}
})

bot.start()
