package io.choerodon.message.api.vo;

import java.util.Set;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModelProperty;
import org.hzero.starter.keyencrypt.core.Encrypt;

/**
 * 〈功能简述〉
 * 〈自定义邮件发送VO〉
 *
 * @author wanghao
 * @since 2020/12/15 16:26
 */
public class CustomEmailSendInfoVO {
    @ApiModelProperty("邮件主题")
    @NotNull
    private String subject;
    @ApiModelProperty("邮件内容")
    @NotNull
    private String content;
    @ApiModelProperty("抄送用户id集合")
    @Encrypt
    private Set<Long> ccIdList;
    @ApiModelProperty("接收用户id集合")
    @Encrypt
    @NotEmpty
    private Set<Long> receiverIdList;
    @ApiModelProperty("base64加密附件")
    String file;
    @ApiModelProperty("附件名")
    String filename;

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public Set<Long> getCcIdList() {
        return ccIdList;
    }

    public void setCcIdList(Set<Long> ccIdList) {
        this.ccIdList = ccIdList;
    }

    public Set<Long> getReceiverIdList() {
        return receiverIdList;
    }

    public void setReceiverIdList(Set<Long> receiverIdList) {
        this.receiverIdList = receiverIdList;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }
}
