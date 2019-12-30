# 定义成一个基类  多个form可以用了
# 打印错误信息的类

class FormMixin:
    def get_error(self):
        if hasattr(self, 'errors'):
            #  {'telephone': [{'message': '这个字段是必填项。', 'code': 'required'}], 'password': [{'message': '密码框不能为空', 'code': 'required'}]}
            errors = self.errors.get_json_data()
            # ('password', [{'message': '密码框不能为空', 'code': 'required'}])
            error_tuple = errors.popitem()
            # [{'message': '密码框不能为空', 'code': 'required'}]
            error_list = error_tuple[1]
            # {'message': '密码框不能为空', 'code': 'required'}
            error_dict = error_list[0]
            message = error_dict["message"]
            return message
        return None