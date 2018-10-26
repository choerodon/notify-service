package io.choerodon.notify.websocket.notify

import io.choerodon.notify.infra.mapper.SiteMsgRecordMapper
import io.choerodon.notify.websocket.relationship.RelationshipDefining
import io.choerodon.notify.websocket.send.MessageSender
import spock.lang.Specification

/**
 * @author dengyouquan
 * */
class SubReceiveSitMsgHandlerSpec extends Specification {
    private RelationshipDefining relationshipDefining = Mock(RelationshipDefining)
    private MessageSender messageSender = Mock(MessageSender)
    private final SiteMsgRecordMapper siteMsgRecordMapper = Mock(SiteMsgRecordMapper)
    private SubReceiveSitMsgHandler subReceiveSitMsgHandler =
            new SubReceiveSitMsgHandler(relationshipDefining, messageSender, siteMsgRecordMapper)

    def "Handle"() {
        given: "构造请求参数"
        def key = "choerodon:msg:code:1"

        when: "调用方法"
        subReceiveSitMsgHandler.handle(null,key)
        then: "校验结果"
        1 * relationshipDefining.contact(_,_)
        1 * relationshipDefining.getKeysBySession(_)
        2 * messageSender.sendWebSocket(_,_)
        1 * siteMsgRecordMapper.selectCountOfUnRead(_) >> 1
    }
}
