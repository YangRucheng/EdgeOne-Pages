const { createApp, defineComponent, ref, reactive, onMounted } = Vue;
const {
    NButton,
    NInput,
    NForm,
    NFormItem,
    NSelect,
    NCard,
    NCheckbox,
    NIcon,
    NMessageProvider,
    useMessage,
    NModal
} = naive;

// 图标组件
const CheckIcon = defineComponent({
    render() {
        return Vue.h(NIcon, null, {
            default: () => Vue.h('svg', {
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 24 24",
                width: "1em",
                height: "1em"
            }, [
                Vue.h('path', {
                    fill: "currentColor",
                    d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8l-8 8z"
                })
            ])
        });
    }
});

const GenerateIcon = defineComponent({
    render() {
        return Vue.h(NIcon, null, {
            default: () => Vue.h('svg', {
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 24 24",
                width: "1em",
                height: "1em"
            }, [
                Vue.h('path', {
                    fill: "currentColor",
                    d: "m17.66 9.53l-7.07 7.07l-4.24-4.24l1.41-1.41l2.83 2.83l5.66-5.66l1.41 1.41M4 12c0-2.33 1.02-4.42 2.62-5.88L9 8.5v-6H3l2.2 2.2C3.24 6.52 2 9.11 2 12c0 5.19 3.95 9.45 9 9.95v-2.02c-3.94-.49-7-3.86-7-7.93m18 0c0-5.19-3.95-9.45-9-9.95v2.02c3.94.49 7 3.86 7 7.93c0 2.33-1.02 4.42-2.62 5.88L15 15.5v6h6l-2.2-2.2c1.96-1.82 3.2-4.41 3.2-7.3Z"
                })
            ])
        });
    }
});

const ResetIcon = defineComponent({
    render() {
        return Vue.h(NIcon, null, {
            default: () => Vue.h('svg', {
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 24 24",
                width: "1em",
                height: "1em"
            }, [
                Vue.h('path', {
                    fill: "currentColor",
                    d: "M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35Z"
                })
            ])
        });
    }
});

const LinkIcon = defineComponent({
    render() {
        return Vue.h(NIcon, null, {
            default: () => Vue.h('svg', {
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 24 24",
                width: "1em",
                height: "1em"
            }, [
                Vue.h('path', {
                    fill: "currentColor",
                    d: "M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8z"
                })
            ])
        });
    }
});

const CopyIcon = defineComponent({
    render() {
        return Vue.h(NIcon, null, {
            default: () => Vue.h('svg', {
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 24 24",
                width: "1em",
                height: "1em"
            }, [
                Vue.h('path', {
                    fill: "currentColor",
                    d: "M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12V1Z"
                })
            ])
        });
    }
});

// 主设置组件
const MainSettings = defineComponent({
    props: {
        formData: Object
    },
    components: {
        NForm,
        NFormItem,
        NInput,
        NSelect,
        NCheckbox,
    },
    setup() {
        const softwareOptions = [
            { label: 'Clash', value: 'clash' },
            { label: 'Surge', value: 'surge' },
            { label: 'Quantumult', value: 'quantumult' },
            { label: 'Shadowrocket', value: 'shadowrocket' }
        ];

        // ACL4SSR 配置选项
        const configOptions = ref([]);
        onMounted(() => {
            fetch("https://github.proxy.yangrucheng.top/repos/ACL4SSR/ACL4SSR/contents/Clash/config?ref=master", {
                cache: 'force-cache',
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                },
            })
                .then(response => response.json())
                .then(res => {
                    configOptions.value = res
                        .filter(item => item.name.endsWith('.ini'))
                        .map(item => ({
                            label: item.name,
                            value: item.name
                        }));
                })
                .catch(error => {
                    console.info("请求 GitHub API 失败", error);
                    configOptions.value = [
                        { label: 'ACL4SSR_Online_Full.ini', value: 'ACL4SSR_Online_Full.ini' },
                        { label: 'ACL4SSR_Online_Full_AdblockPlus.ini', value: 'ACL4SSR_Online_Full_AdblockPlus.ini' },
                    ];
                });
        })

        return {
            softwareOptions,
            configOptions
        };
    },
    render() {
        return Vue.h(NCard, { class: "card" }, {
            header: () => Vue.h('div', { class: "card-title" }, [
                Vue.h(CheckIcon, { size: 18 }),
                '订阅转换设置'
            ]),
            default: () => Vue.h(NForm, { model: this.formData }, {
                default: () => [
                    Vue.h('div', { class: "form-row" }, [
                        Vue.h('div', { class: "form-item" }, [
                            Vue.h(NFormItem, { label: "后端地址", size: "small" }, {
                                default: () => Vue.h(NInput, {
                                    value: this.formData.backendUrl,
                                    'onUpdate:value': (val) => this.formData.backendUrl = val,
                                    placeholder: "请输入后端地址",
                                    size: "small"
                                })
                            })
                        ]),
                        Vue.h('div', { class: "form-item" }, [
                            Vue.h(NFormItem, { label: "软件类型", size: "small" }, {
                                default: () => Vue.h(NSelect, {
                                    value: this.formData.softwareType,
                                    'onUpdate:value': (val) => this.formData.softwareType = val,
                                    options: this.softwareOptions,
                                    size: "small"
                                })
                            })
                        ])
                    ]),
                    Vue.h(NFormItem, { label: "订阅链接", size: "small" }, {
                        default: () => Vue.h(NInput, {
                            value: this.formData.subscriptionUrl,
                            'onUpdate:value': (val) => this.formData.subscriptionUrl = val,
                            placeholder: "请输入您的订阅链接",
                            type: "textarea",
                            autosize: { minRows: 2, maxRows: 4 },
                            size: "small"
                        })
                    }),
                    Vue.h('div', { class: "form-row" }, [
                        Vue.h('div', { class: "form-item" }, [
                            Vue.h(NFormItem, { label: "规则配置", size: "small" }, {
                                default: () => Vue.h(NSelect, {
                                    value: this.formData.configName,
                                    'onUpdate:value': (val) => {
                                        this.formData.configName = val;
                                        this.formData.configUrl = `https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/${val}`;
                                    },
                                    options: this.configOptions,
                                    filterable: true,
                                    placeholder: "选择规则配置",
                                    size: "small"
                                })
                            })
                        ]),
                        Vue.h('div', { class: "form-item" }, [
                            Vue.h(NFormItem, { label: "自定义配置URL", size: "small" }, {
                                default: () => Vue.h(NInput, {
                                    value: this.formData.customConfigUrl,
                                    'onUpdate:value': (val) => {
                                        this.formData.customConfigUrl = val;
                                        if (val) {
                                            this.formData.configUrl = val;
                                            this.formData.configName = '';
                                        }
                                    },
                                    placeholder: "或输入自定义配置URL",
                                    size: "small"
                                })
                            })
                        ])
                    ]),
                    Vue.h(NFormItem, { label: "其他选项", size: "small" }, {
                        default: () => Vue.h('div', { class: "checkbox-group" }, [
                            Vue.h(NCheckbox, {
                                checked: this.formData.newName,
                                'onUpdate:checked': (val) => this.formData.newName = val,
                                size: "small"
                            }, { default: () => '重命名' }),
                            Vue.h(NCheckbox, {
                                checked: this.formData.emoji,
                                'onUpdate:checked': (val) => this.formData.emoji = val,
                                size: "small"
                            }, { default: () => '显示Emoji' }),
                            Vue.h(NCheckbox, {
                                checked: this.formData.insert,
                                'onUpdate:checked': (val) => this.formData.insert = val,
                                size: "small"
                            }, { default: () => '插入模式' })
                        ])
                    }),
                    Vue.h('div', { class: "form-row" }, [
                        Vue.h('div', { class: "form-item" }, [
                            Vue.h(NFormItem, { label: "包含节点", size: "small" }, {
                                default: () => Vue.h(NInput, {
                                    value: this.formData.include,
                                    'onUpdate:value': (val) => this.formData.include = val,
                                    placeholder: "正则表达式",
                                    size: "small"
                                })
                            })
                        ]),
                        Vue.h('div', { class: "form-item" }, [
                            Vue.h(NFormItem, { label: "排除节点", size: "small" }, {
                                default: () => Vue.h(NInput, {
                                    value: this.formData.exclude,
                                    'onUpdate:value': (val) => this.formData.exclude = val,
                                    placeholder: "正则表达式",
                                    size: "small"
                                })
                            })
                        ])
                    ])
                ]
            })
        });
    }
});

// 主组件
const SubscriptionConverter = defineComponent({
    components: {
        MainSettings,
        NButton,
        NIcon,
        NModal
    },
    setup() {
        const message = useMessage();

        // 表单数据
        const formData = reactive({
            backendUrl: 'https://sub.misaka-network.top/sub?',
            softwareType: 'clash',
            subscriptionUrl: '',
            configName: 'ACL4SSR_Online_Full_AdblockPlus.ini',
            configUrl: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_AdblockPlus.ini',
            customConfigUrl: '',
            newName: true,
            emoji: true,
            insert: false,
            include: '',
            exclude: ''
        });

        // 控制结果弹窗显示
        const showResultModal = ref(false);

        // 生成的订阅链接
        const resultUrl = ref('');

        // 复制到剪贴板
        const copyToClipboard = async () => {
            try {
                await navigator.clipboard.writeText(resultUrl.value);
                message.success('链接已复制到剪贴板');
            } catch (err) {
                // 降级方案
                const textArea = document.createElement('textarea');
                textArea.value = resultUrl.value;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                message.success('链接已复制到剪贴板');
            }
        };

        // 生成订阅链接
        const generateUrl = () => {
            if (!formData.subscriptionUrl) {
                message.warning('请输入订阅链接');
                return;
            }

            // 构建参数
            let params = `target=${formData.softwareType}`;
            params += `&new_name=${formData.newName}`;
            params += `&url=${encodeURIComponent(formData.subscriptionUrl)}`;
            params += `&insert=${formData.insert}`;
            params += `&config=${encodeURIComponent(formData.configUrl)}`;
            params += `&emoji=${formData.emoji}`;

            if (formData.include) {
                params += `&include=${encodeURIComponent(formData.include)}`;
            }

            if (formData.exclude) {
                params += `&exclude=${encodeURIComponent(formData.exclude)}`;
            }

            // 生成完整URL
            resultUrl.value = `${formData.backendUrl}${params}`;

            // 显示结果弹窗
            showResultModal.value = true;

            message.success('订阅链接生成成功');
        };

        // 重置表单
        const resetForm = () => {
            formData.backendUrl = 'https://sub.misaka-network.top/sub?';
            formData.softwareType = 'clash';
            formData.subscriptionUrl = '';
            formData.configName = 'ACL4SSR_Online_Full_AdblockPlus.ini';
            formData.configUrl = 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_AdblockPlus.ini';
            formData.customConfigUrl = '';
            formData.newName = true;
            formData.emoji = true;
            formData.insert = false;
            formData.include = '';
            formData.exclude = '';
            resultUrl.value = '';

            message.info('表单已重置');
        };

        return {
            formData,
            resultUrl,
            showResultModal,
            generateUrl,
            resetForm,
            copyToClipboard
        };
    },
    render() {
        return Vue.h('div', { class: "container" }, [
            Vue.h('header', {}, [
                Vue.h('h1', {}, '订阅转换工具'),
                Vue.h('p', { class: "description" }, '将您的订阅链接转换为目标软件格式')
            ]),
            Vue.h(MainSettings, { formData: this.formData }),
            Vue.h('div', { class: "action-buttons" }, [
                Vue.h(NButton, {
                    type: "primary",
                    size: "medium",
                    onClick: this.generateUrl,
                    disabled: !this.formData.subscriptionUrl
                }, {
                    default: () => '生成订阅链接',
                    icon: () => Vue.h(GenerateIcon)
                }),
                Vue.h(NButton, {
                    size: "medium",
                    onClick: this.resetForm
                }, {
                    default: () => '重置',
                    icon: () => Vue.h(ResetIcon)
                })
            ]),
            Vue.h(NModal, {
                show: this.showResultModal,
                onUpdateShow: (val) => { this.showResultModal = val; },
                preset: "dialog",
                title: "生成的订阅链接",
                positiveText: "复制链接",
                negativeText: "关闭",
                onPositiveClick: this.copyToClipboard,
                onNegativeClick: () => { this.showResultModal = false; }
            }, {
                default: () => Vue.h('div', { class: "result-modal-content" }, [
                    Vue.h('div', { class: "result-url" }, this.resultUrl),
                    Vue.h('p', { style: { fontSize: '13px', color: '#666', marginTop: '10px' } },
                        '复制此链接并在您的代理软件中使用')
                ])
            }),
            Vue.h('footer', {}, [
                Vue.h('p', {}, '订阅转换工具 | 御坂网络工作室 | 本工具仅用于学习和交流')
            ])
        ]);
    }
});

// 创建主应用
const App = defineComponent({
    components: {
        NMessageProvider,
        SubscriptionConverter
    },
    setup() {
        return {};
    },
    render() {
        return Vue.h(NMessageProvider, {}, {
            default: () => Vue.h(SubscriptionConverter)
        });
    }
});

const app = createApp(App);
app.use(naive);
app.mount('#app');