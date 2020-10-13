package io.choerodon.message.app.eventhandler.payload;

import java.util.Set;

/**
 * @author flyleft
 * @since 2018/4/10
 */
public class UserMemberEventPayload {

    private Long userId;

    private String username;

    private Long resourceId;

    private String resourceType;

    private Set<String> roleLabels;

    private String uuid;

    private Boolean syncAll;

    public Set<String> getRoleLabels() {
        return roleLabels;
    }

    public void setRoleLabels(Set<String> roleLabels) {
        this.roleLabels = roleLabels;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Long getResourceId() {
        return resourceId;
    }

    public void setResourceId(Long resourceId) {
        this.resourceId = resourceId;
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Boolean getSyncAll() {
        return syncAll;
    }

    public void setSyncAll(Boolean syncAll) {
        this.syncAll = syncAll;
    }
}
